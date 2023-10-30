export interface Collection {
    categoryName: string;
    id: string;
    description: string;
    name: string
    cards: any[]
  }
export interface RootState {    
    categoryReducer: {
        isCategoryModalOpen: boolean;
        categoryName:string
        categoryColor:string
    };
    collectionsSlice:{
        collections:Collection[]
    }
}
