import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, docData, collectionData, WithFieldValue, DocumentData, query, where, WhereFilterOp, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { CacheService } from '../cache.service';
import { CacheDuration } from 'src/app/interfaces/cache';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore, private cacheService: CacheService) {
  }

  // Insertar un nuevo documento
  insertData<T extends WithFieldValue<DocumentData>>(collectionPath: string, data: T): Promise<DocumentData> {
    const collectionRef = collection(this.firestore, collectionPath);
    return addDoc(collectionRef, data);
  }

  async insertDataIfNotExists<T extends WithFieldValue<DocumentData>>
    (config: {collectionPath: string, data: T, conditions: { field: string, operator: WhereFilterOp, value: string }[]}): Promise<DocumentData> {
    const collectionRef = collection(this.firestore, config.collectionPath);
    
    // Crear la consulta base
    let q = query(collectionRef);
    for (const condition of config.conditions) {
      q = query(q, where(condition.field, condition.operator, condition.value));
    }

    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty) {
      return addDoc(collectionRef, config.data);
    } else {
      console.log('Documento ya existe');
      return Promise.resolve(querySnapshot.docs[0]);
    }
  }

  // Actualizar un documento existente
  updateData<T extends Partial<WithFieldValue<DocumentData>>>(collectionPath: string, id: string, data: T): Promise<void> {
    const documentRef = doc(this.firestore, `${collectionPath}/${id}`);
    return updateDoc(documentRef, { ...data })
      .then(() => console.log('Documento actualizado con éxito'))
      .catch(error => console.error('Error al actualizar documento: ', error));
  }

  // Obtener todos los documentos de la colección
  getAllData<T>(config: { collection: string, where: string[], cache?: CacheDuration }): Promise<T[]> {
    
    const getFromServer = async (): Promise<T[]> => {
      const collectionRef = collection(this.firestore, config.collection);
      const q = query(collectionRef, where(config.where[0], config.where[1] as WhereFilterOp, config.where[2]));
      const querySnapshot = await getDocs(q);


      let docs: T[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(doc.data() as T);  
        console.log(`${doc.id} =>`, doc.data());
      });
      
      if(config.cache) {
        this.cacheService.setCachedData(config.collection, docs, config.cache);
      }
      // const data          = collectionData(collectionRef, { idField: 'id' });

      console.log(`${config.collection} docs: `, docs);
      return docs;
    }

    if(config.cache) {
      const data: T[] | null = this.cacheService.getCachedData<T[]>(config.collection);

      if(data) {
        console.log(config.collection + ' obtenidos de la caché', data);
        return new Promise((resolve) => resolve(data));
      }
    }
    return getFromServer();
  }

  // Obtener un documento por ID
  getDocById<T extends DocumentData>(collectionPath: string, id: string, cache?: string): Observable<T> {
    const documentRef = doc(this.firestore, `${collectionPath}/${id}`);
    return docData(documentRef, { idField: 'id' }) as Observable<T>;
  }
}
