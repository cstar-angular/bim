import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  private projectTypeDBPath = 'project_type';
  private contractTypeDBPath = 'contract_type';
  private lengthDBPath = 'length';
  private areaDBPath = 'area';
  private volumnDBPath = 'volume';
  private angleDBPath = 'angle';
  private roundingDBPath = 'rounding';

  projectTypesRef: AngularFireList<any[]> = null;
  contractTypesRef: AngularFireList<any[]> = null;
  lengthsRef: AngularFireList<any[]> = null;
  areasRef: AngularFireList<any[]> = null;
  volumnsRef: AngularFireList<any[]> = null;
  anglesRef: AngularFireList<any[]> = null;
  roundingsRef: AngularFireList<any[]> = null;

  constructor(private db: AngularFireDatabase) { }

  getProjectTypes() {
    return this.projectTypesRef = this.db.list(this.projectTypeDBPath);
  }

  getContractTypes() {
    return this.contractTypesRef = this.db.list(this.contractTypeDBPath);
  }

  getLengths() {
    return this.lengthsRef = this.db.list(this.lengthDBPath);
  }

  getAreas() {
    return this.areasRef = this.db.list(this.areaDBPath);
  }

  getVolumns() {
    return this.volumnsRef = this.db.list(this.volumnDBPath);
  }

  getAngles() {
    return this.anglesRef = this.db.list(this.angleDBPath);
  }

  getRoundings() {
    return this.roundingsRef = this.db.list(this.roundingDBPath);
  }
}
