import Auth from "../../../components/scripts/auth.js";

const Cart = {

    _key() {
        const user = Auth.getUser();
        if (!user) return "borrowCart_guest";           // fallback, shouldn't happen
        return `borrowCart_${user.id}`;                 // e.g. "borrowCart_2"
    },

    getItems() {
        return JSON.parse(localStorage.getItem(this._key()) || "[]");
    },

    addItem(book) {
        const items = this.getItems();
        const already = items.find(b => b.id === book.id);
        if (already) return false;                      // no duplicates

        items.push({
            id:     book.id,
            title:  book.title,
            author: book.author,
            cover:  book.cover,
            genre:  book.genre,
        });

        localStorage.setItem(this._key(), JSON.stringify(items));
        this._notify();
        return true;
    },

    removeItem(bookId) {
        const items = this.getItems().filter(b => b.id !== bookId);
        localStorage.setItem(this._key(), JSON.stringify(items));
        this._notify();
    },

    clear() {
        localStorage.removeItem(this._key());
        this._notify();
    },

    count() {
        return this.getItems().length;
    },

    // Simple pub/sub so any part of the UI can react to cart changes
    _listeners: [],
    onChange(fn) {
        this._listeners.push(fn);
    },
    _notify() {
        this._listeners.forEach(fn => fn(this.getItems()));
    }
};

export default Cart;