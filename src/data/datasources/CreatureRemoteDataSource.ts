export class CreatureRemoteDataSource {

//@todo: deberíamos dejarlo en un archivo de configuración, pero por simplicidad lo dejamos aquí
//además se pedía tratar de no agregar librerías externas, por lo que no agregamos dotenv ni similares

private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

//obtenemos la lista de criaturas pasando el límite y el offset, que son requeridos por la API
  async getRawList(limit: number, offset: number) {
    const response = await fetch(`${this.baseUrl}?limit=${limit}&offset=${offset}`);
    if (!response.ok) throw new Error('PokeAPI connectivity issues');
    return await response.json();
  }

  //Obtenemos los detalles de una criatura pasando su id o nombre, que son requeridos por la API
  async getRawDetails(idOrName: string) {
    const response = await fetch(`${this.baseUrl}/${idOrName}`);
    if (!response.ok) throw new Error(`Failed to fetch metadata for ${idOrName}`);
    return await response.json();
  }
}