class Book {
    id : number
    constructor(public author : string) {
        this.id = Book.booksIds++;
    }
    static booksIds = 0
}

class Movie {
    id : number
    constructor(public director : string) {
        this.id = Movie.movieIds++;
    }
    static movieIds = 0
}

const someMovie = new Movie('some director');

interface ItemTypes {
    book : Book;
    movie: Movie;
}

class Store {

    items : {
        [Key in keyof ItemTypes] : {[Key : number ] : ItemTypes[Key]} 
    } = {
        book : {  },
        movie : { [someMovie.id] :  someMovie }
    }

    create<TItemKey extends keyof ItemTypes, Item extends ItemTypes[TItemKey]>(itemType : TItemKey, item: Item) {
        const id = item.id;
        this.items[itemType][id] = item;
    }

    getById<TItemKey extends keyof ItemTypes>(itemType : TItemKey, id : number) {
        return this.items[itemType][id];
    }
    getAll<TItemKey extends keyof ItemTypes>(itemType : TItemKey) {
        return this.items[itemType]
    }

    update<TItemKey extends keyof ItemTypes>(itemType : TItemKey, id: number, update : Omit<Partial<ItemTypes[TItemKey]>, 'id'>
    ) {
        const item = this.items[itemType][id];
        this.items[itemType][id] = {...item,  ...update};
    }
}

const store = new Store();
const books = store.getAll('book')
store.create('book', new Book('some author'));
store.create('book', new Book('some other author'));
console.log(books)
store.update('book', 0, { author : "Changed"})
const booksAgain = store.getAll('book')
console.log(booksAgain)
