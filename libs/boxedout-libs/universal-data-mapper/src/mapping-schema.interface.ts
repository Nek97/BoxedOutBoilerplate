/**
 * Rappresenta la definizione di trasformazione tra un DB di origine e uno di destinazione.
 */
export interface MappingSchema {
  /**
   * Mappa le chiavi dell'oggetto di destinazione (es. MongoDB/JSON)
   * ai valori estratti dall'oggetto sorgente (SQL Join).
   *
   * Il valore può essere:
   * - Una stringa che rappresenta un path Lodash (es. `user.profile.age`)
   * - Una funzione custom per trasformazioni complesse (es. somme, date)
   */
  fields: Record<string, string | ((sourcePayload: any) => any)>;

  /**
   * (Opzionale) Permette di definire dei valori costanti/di default che 
   * vengono applicati all'oggetto di destinazione a prescindere dal source.
   */
  defaults?: Record<string, any>;
}
