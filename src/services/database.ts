import Dexie, { Table } from 'dexie';
import { HealthRecord, Medicine, Prescription, SOSRequest, SyncQueueItem, User } from '../types';

export class PatientPortalDB extends Dexie {
  // Tables
  users!: Table<User>;
  healthRecords!: Table<HealthRecord>;
  medicines!: Table<Medicine>;
  prescriptions!: Table<Prescription>;
  sosRequests!: Table<SOSRequest>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('PatientPortalDB');
    
    this.version(1).stores({
      users: 'id, phoneNumber, aadhaarHash, isVerified, createdAt',
      healthRecords: 'id, userId, type, date, synced, createdAt',
      medicines: 'id, name, genericName, pharmacyId, stock, expiryDate',
      prescriptions: 'id, patientId, doctorId, issuedAt, validUntil',
      sosRequests: 'id, userId, timestamp, status, emergencyType',
      syncQueue: 'id, type, timestamp, retryCount',
    });

    // Hooks for data encryption/decryption
    this.healthRecords.hook('creating', (primKey, obj, trans) => {
      // Encrypt sensitive data before storing
      if (obj.description) {
        obj.description = this.encryptData(obj.description);
      }
    });

    this.healthRecords.hook('reading', (obj) => {
      // Decrypt sensitive data when reading
      if (obj.description) {
        obj.description = this.decryptData(obj.description);
      }
    });
  }

  private encryptData(data: string): string {
    // Simple encryption - in production, use proper encryption
    return btoa(data);
  }

  private decryptData(encryptedData: string): string {
    // Simple decryption - in production, use proper decryption
    try {
      return atob(encryptedData);
    } catch {
      return encryptedData; // Return as-is if decryption fails
    }
  }

  // Helper methods for common operations
  async getUnsyncedHealthRecords(): Promise<HealthRecord[]> {
    return await this.healthRecords.where('synced').equals(0).toArray();
  }

  async getUnsyncedSOSRequests(): Promise<SOSRequest[]> {
    return await this.sosRequests.where('status').equals('pending').toArray();
  }

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<void> {
    const syncItem: SyncQueueItem = {
      ...item,
      id: Date.now().toString(),
    };
    await this.syncQueue.add(syncItem);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return await this.syncQueue.orderBy('timestamp').toArray();
  }

  async removeFromSyncQueue(id: string): Promise<void> {
    await this.syncQueue.delete(id);
  }

  async clearSyncQueue(): Promise<void> {
    await this.syncQueue.clear();
  }

  // Health Records specific methods
  async addHealthRecord(record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await this.healthRecords.add(newRecord);
    return newRecord.id;
  }

  async updateHealthRecord(id: string, updates: Partial<HealthRecord>): Promise<void> {
    await this.healthRecords.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }

  async getHealthRecordsByUser(userId: string): Promise<HealthRecord[]> {
    return await this.healthRecords
      .where('userId')
      .equals(userId)
      .toArray()
      .then(records => records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  // Medicine Stock specific methods
  async updateMedicineStock(medicineId: string, newStock: number): Promise<void> {
    await this.medicines.update(medicineId, { stock: newStock });
  }

  async getMedicinesByPharmacy(pharmacyId: string): Promise<Medicine[]> {
    return await this.medicines.where('pharmacyId').equals(pharmacyId).toArray();
  }

  async searchMedicines(query: string): Promise<Medicine[]> {
    return await this.medicines
      .filter(medicine => 
        medicine.name.toLowerCase().includes(query.toLowerCase()) ||
        medicine.genericName.toLowerCase().includes(query.toLowerCase())
      )
      .toArray();
  }

  // Prescription specific methods
  async getPrescriptionsByUser(userId: string): Promise<Prescription[]> {
    return await this.prescriptions
      .where('patientId')
      .equals(userId)
      .toArray()
      .then(prescriptions => prescriptions.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()));
  }

  async getValidPrescriptions(userId: string): Promise<Prescription[]> {
    const now = new Date().toISOString();
    return await this.prescriptions
      .where('patientId')
      .equals(userId)
      .filter(prescription => prescription.validUntil > now)
      .toArray();
  }

  // SOS specific methods
  async addSOSRequest(request: Omit<SOSRequest, 'id'>): Promise<string> {
    const newRequest: SOSRequest = {
      ...request,
      id: Date.now().toString(),
    };
    
    await this.sosRequests.add(newRequest);
    return newRequest.id;
  }

  async getSOSHistoryByUser(userId: string): Promise<SOSRequest[]> {
    return await this.sosRequests
      .where('userId')
      .equals(userId)
      .toArray()
      .then(requests => requests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }

  // User specific methods
  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    return await this.users.where('phoneNumber').equals(phoneNumber).first();
  }

  async saveUser(user: User): Promise<void> {
    await this.users.put(user);
  }

  // Data export/import for backup
  async exportData(): Promise<any> {
    const data = {
      users: await this.users.toArray(),
      healthRecords: await this.healthRecords.toArray(),
      medicines: await this.medicines.toArray(),
      prescriptions: await this.prescriptions.toArray(),
      sosRequests: await this.sosRequests.toArray(),
      exportDate: new Date().toISOString(),
    };
    return data;
  }

  async importData(data: any): Promise<void> {
    await this.transaction('rw', [this.users, this.healthRecords, this.medicines, this.prescriptions, this.sosRequests], async () => {
      if (data.users) await this.users.bulkPut(data.users);
      if (data.healthRecords) await this.healthRecords.bulkPut(data.healthRecords);
      if (data.medicines) await this.medicines.bulkPut(data.medicines);
      if (data.prescriptions) await this.prescriptions.bulkPut(data.prescriptions);
      if (data.sosRequests) await this.sosRequests.bulkPut(data.sosRequests);
    });
  }
}

// Create and export database instance
export const db = new PatientPortalDB();

// Initialize database
export const initializeDatabase = async (): Promise<void> => {
  try {
    await db.open();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};
