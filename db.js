// Database utility for localStorage
const DB = {
  // Initialize with sample data
  init() {
    if (!localStorage.getItem('books')) {
      const sampleBooks = [
        {
          id: 1,
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          year: 1925,
          description: 'A classic American novel about the Jazz Age and the American Dream.',
          cover: './assets/books/the-great-gatsby.jpg',
          available: 5,
          total: 10,
          trending: true
        },
        {
          id: 2,
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          genre: 'Fantasy',
          year: 1960,
          description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
          cover: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop',
          available: 3,
          total: 8,
          trending: true
        },
        {
          id: 3,
          title: '1984',
          author: 'George Orwell',
          genre: 'Dystopian',
          year: 1949,
          description: 'A dystopian novel about a totalitarian society under constant surveillance.',
          cover: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=400&fit=crop',
          available: 2,
          total: 7,
          trending: true
        },
        {
          id: 4,
          title: 'Pride and Prejudice',
          author: 'Jane Austen',
          genre: 'Romance',
          year: 1813,
          description: 'A romantic novel about Elizabeth Bennet and Mr. Darcy in Georgian England.',
          cover: './assets/books/pride-prejudice.jpg',
          available: 4,
          total: 9,
          trending: false
        },
        {
          id: 5,
          title: 'The Catcher in the Rye',
          author: 'J.D. Salinger',
          genre: 'Fiction',
          year: 1951,
          description: 'A controversial novel about teenage rebellion and alienation.',
          cover: './assets/books/the-catcher-in-the-rye.jpg',
          available: 6,
          total: 10,
          trending: false
        },
        {
          id: 6,
          title: 'Brave New World',
          author: 'Aldous Huxley',
          genre: 'Dystopian',
          year: 1932,
          description: 'A futuristic novel depicting a seemingly perfect but ultimately hollow society.',
          cover: './assets/books/brave-new-world.jpg',
          available: 1,
          total: 5,
          trending: true
        },
        {
          id: 7,
          title: `Harry Potter and the Sorcerer's Stone`,
          author: 'J.K. Rowling',
          genre: 'Fantasy',
          year: 1997,
          description: `On his eleventh birthday, an orphaned boy named Harry Potter discovers he is a wizard and has been invited to attend Hogwarts School of Witchcraft and Wizardry. As he escapes his mundane life with his cruel aunt and uncle, Harry enters a world of magic, friendship, and danger, eventually uncovering a plot to steal a legendary object hidden within the school's walls.`,
          cover: './assets/books/harry-potter.jpg',
          available: 5,
          total: 10,
          trending: true
        },
        {
          id: 8,
          title: 'Stoner',
          author: 'John Williams',
          genre: 'Classic',
          year: '1965',
          description: 'A quiet, introspective novel about a university professor’s life, exploring themes of love, failure, and personal dignity. Despite its simple premise, it delivers a deeply emotional and thought-provoking portrait of an ordinary man’s inner world.',
          cover: './assets/books/stoner.jpg',
          available: 5,
          total: 10,
          trending: true
        },
        {
          id: 9,
          title: 'The Hobbit',
          author: 'J.R.R. Tolkien',
          genre: 'Fantasy',
          year: 1937,
          description: 'A reluctant hobbit, Bilbo Baggins, sets out on an epic adventure to reclaim a stolen treasure from the fearsome dragon Smaug.',
          cover: './assets/books/the-hobbit.png',
          available: 3,
          total: 8,
          trending: true
        },
        {
          id: 10,
          title: 'Frankenstein',
          author: 'Mary Shelley',
          genre: 'Gothic Horror',
          year: 1818,
          description: 'A scientist creates a sentient creature in an unorthodox scientific experiment, only to be horrified by the consequences of his ambition.',
          cover: './assets/books/frankenstein.jpg',
          available: 3,
          total: 5,
          trending: false
        },
        {
          id: 11,
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          genre: 'Adventure',
          year: 1988,
          description: 'A mystical story of a shepherd boy who travels to Egypt in search of a treasure, discovering the importance of listening to his heart.',
          cover: './assets/books/the-alchemist.jpg',
          available: 12,
          total: 20,
          trending: true
        },
        {
          id: 12,
          title: 'The Spanish Love Deception',
          author: 'Elena Armas',
          genre: 'Romance',
          year: 2021,
          description: "A woman brings her colleague as a fake boyfriend to her sister's wedding in Spain, only to find the lines between pretend and reality blurring.",
          cover: './assets/books/the-spanish-love-deception.jpg',
          available: 7,
          total: 12,
          trending: true
        },
        {
          id: 13,
          title: 'The Shining',
          author: 'Stephen King',
          genre: 'Horror',
          year: 1977,
          description: 'A family stays in an isolated hotel for the winter, where a sinister presence influences the father into violence.',
          cover: './assets/books/the-shining.jpg',
          available: 2,
          total: 5,
          trending: true
        },
        {
          id: 14,
          title: 'The Hunger Games',
          author: 'Suzanne Collins',
          genre: 'Young Adult',
          year: 2008,
          description: "In a dystopian nation, Katniss Everdeen volunteers to take her sister\'s place in a televised fight to the death.",
          cover: './assets/books/the-hunger-games.jpg',
          available: 15,
          total: 25,
          trending: true
        },
        {
          id: 15,
          title: 'Atomic Habits',
          author: 'James Clear',
          genre: 'Self-Help',
          year: 2018,
          description: 'A practical guide to breaking bad habits and building good ones by making small, incremental changes every day.',
          cover: './assets/books/atomic-habits.jpg',
          available: 25,
          total: 30,
          trending: true
        },
        {
          id: 16,
          title: 'Love, Theoretically',
          author: 'Ali Hazelwood',
          genre: 'Romance',
          year: 2023,
          description: 'A physics professor who moonlights as a professional fake girlfriend finds her worlds colliding when she meets the man who ruined her career.',
          cover: './assets/books/love-theoretically.jpg',
          available: 10,
          total: 15,
          trending: true
        },
        // MYSTERY
        {
          id: 17,
          title: 'Murder on the Orient Express',
          author: 'Agatha Christie',
          genre: 'Mystery',
          year: 1934,
          description: 'Detective Hercule Poirot must identify a killer among a group of diverse passengers on a snowbound luxury train.',
          cover: './assets/books/murder-on-the-orient-express.jpg',
          available: 5,
          total: 8,
          trending: false
        },
        // FABLE
        {
          id: 18,
          title: 'The Little Prince',
          author: 'Antoine de Saint-Exupéry',
          genre: 'Fable',
          year: 1943,
          description: 'A pilot stranded in the desert meets a young prince from a tiny asteroid who shares profound insights about human nature.',
          cover: './assets/books/the-little-prince.jpg',
          available: 20,
          total: 30,
          trending: true
        },
        {
          id: 19,
          title: 'Circe',
          author: 'Madeline Miller',
          genre: 'Fantasy',
          year: 2018,
          description: 'A bold reimagining of the life of the banished witch-goddess Circe as she hones her powers and crosses paths with famous gods and heroes.',
          cover: './assets/books/circe.jpg',
          available: 5,
          total: 10,
          trending: true
        },
        {
          id: 20,
          title: 'Gone Girl',
          author: 'Gillian Flynn',
          genre: 'Mystery',
          year: 2012,
          description: 'When Amy Dunne disappears on her fifth wedding anniversary, her husband Nick becomes the prime suspect in a dark, media-fueled investigation.',
          cover: './assets/books/gone-girl.jpg',
          available: 8,
          total: 15,
          trending: false
        },
        {
          id: 21,
          title: 'Mexican Gothic',
          author: 'Silvia Moreno-Garcia',
          genre: 'Horror',
          year: 2020,
          description: 'A glamorous socialite travels to a distant mansion in the Mexican countryside to rescue her cousin from a mysterious and haunting family.',
          cover: './assets/books/mexican-gothic.jpg',
          available: 4,
          total: 6,
          trending: true
        },
        {
          id: 22,
          title: 'Beach Read',
          author: 'Emily Henry',
          genre: 'Romance',
          year: 2020,
          description: "Two writers with massive writer's block spend the summer in neighboring beach houses, challenging each other to write in the other's genre.",
          cover: './assets/books/beach-read.jpg',
          available: 11,
          total: 18,
          trending: true
        },
        {
          id: 23,
          title: 'Meditations',
          author: 'Marcus Aurelius',
          genre: 'Philosophy',
          year: 180,
          description: 'A series of personal reflections and private notes by the Roman Emperor, offering timeless Stoic wisdom on duty, life, and death.',
          cover: './assets/books/meditations.jpg',
          available: 15,
          total: 20,
          trending: false
        },
        {
          id: 24,
          title: 'A Brief History of Time',
          author: 'Stephen Hawking',
          genre: 'Science',
          year: 1988,
          description: 'A landmark book that explains the most complex concepts of cosmology, from the Big Bang to black holes, for the general reader.',
          cover: './assets/books/brief-history-time.jpg',
          available: 9,
          total: 12,
          trending: false
        },
        {
          id: 25,
          title: 'Fermat\'s Enigma',
          author: 'Simon Singh',
          genre: 'Math',
          year: 1997,
          description: "The epic story of the quest to solve the world's greatest mathematical problem: Fermat's Last Theorem.",
          cover: './assets/books/fermats-enigma.jpg',
          available: 3,
          total: 5,
          trending: false
        },
        {
          id: 26,
          title: 'Clean Code',
          author: 'Robert C. Martin',
          genre: 'Programming',
          year: 2008,
          description: 'A handbook of agile software craftsmanship that teaches developers how to write better, more maintainable, and efficient code.',
          cover: './assets/books/clean-code.jpg',
          available: 10,
          total: 20,
          trending: true
        },
        {
          id: 27,
          title: 'The Midnight Library',
          author: 'Matt Haig',
          genre: 'Fiction',
          year: 2020,
          description: 'Between life and death there is a library where Nora Seed can explore all the different lives she could have lived.',
          cover: './assets/books/midnight-library.jpg',
          available: 12,
          total: 25,
          trending: true
        },
        {
          id: 28,
          title: 'Deep Work',
          author: 'Cal Newport',
          genre: 'Self-Help',
          year: 2016,
          description: 'Rules for focused success in a distracted world, explaining how to master the ability to focus without distraction on cognitively demanding tasks.',
          cover: './assets/books/deep-work.jpg',
          available: 7,
          total: 10,
          trending: true
        },
        {
          id: 29,
          title: 'The Name of the Wind',
          author: 'Patrick Rothfuss',
          genre: 'Fantasy',
          year: 2007,
          description: 'The tale of Kvothe, a legendary figure who grew from a traveling troupe performer to the most notorious wizard the world has ever known.',
          cover: './assets/books/name-of-the-wind.jpg',
          available: 4,
          total: 8,
          trending: true
        },
        {
          id: 30,
          title: 'The Seven Husbands of Evelyn Hugo',
          author: 'Taylor Jenkins Reid',
          genre: 'Fiction',
          year: 2017,
          description: 'An aging Hollywood icon recounts her glamorous and scandalous life story, revealing the truth about her seven marriages and her one true love.',
          cover: './assets/books/evelyn-hugo.jpg',
          available: 15,
          total: 20,
          trending: true
        },
        {
          id: 31,
          title: 'Bird Box',
          author: 'Josh Malerman',
          genre: 'Horror',
          year: 2014,
          description: 'Five years after something monstrous wiped out most of the population, a mother and her children must navigate a river blindfolded to find safety.',
          cover: './assets/books/bird-box.jpg',
          available: 3,
          total: 10,
          trending: false
        },
        {
          id: 32,
          title: 'People We Meet on Vacation',
          author: 'Emily Henry',
          genre: 'Romance',
          year: 2021,
          description: 'Two polar-opposite best friends who haven\'t spoken in two years decide to take one last vacation together to fix their relationship.',
          cover: './assets/books/people-we-meet.jpg',
          available: 10,
          total: 14,
          trending: true
        },
        {
          id: 33,
          title: 'Fourth Wing',
          author: 'Rebecca Yarros',
          genre: 'Fantasy',
          year: 2023,
          description: 'Twenty-year-old Violet Sorrengail must survive a brutal elite war college for dragon riders where the competition is literally deadly.',
          cover: './assets/books/fourth-wing.jpg',
          available: 2,
          total: 15,
          trending: true
        },
        {
          id: 34,
          title: 'Lessons in Chemistry',
          author: 'Bonnie Garmus',
          genre: 'Fiction',
          year: 2022,
          description: 'In the 1960s, a frustrated chemist becomes the unlikely star of a beloved TV cooking show and uses it to challenge the status quo.',
          cover: './assets/books/lessons-in-chemistry.jpg',
          available: 12,
          total: 18,
          trending: true
        },
        {
          id: 35,
          title: 'The Haunting of Hill House',
          author: 'Shirley Jackson',
          genre: 'Horror',
          year: 1959,
          description: 'Four people arrive at a notorious mansion to study supernatural phenomena, only to find the house choosing one of them to make its own.',
          cover: './assets/books/hill-house.jpg',
          available: 5,
          total: 7,
          trending: false
        },
        {
          id: 36,
          title: 'The Unhoneymooners',
          author: 'Christina Lauren',
          genre: 'Romance',
          year: 2019,
          description: 'After a wedding party gets food poisoning, the only two survivors—who happen to be bitter rivals—take the free honeymoon trip to Hawaii.',
          cover: './assets/books/unhoneymooners.jpg',
          available: 6,
          total: 10,
          trending: false
        },
        {
          id: 37,
          title: 'Mistborn: The Final Empire',
          author: 'Brandon Sanderson',
          genre: 'Fantasy',
          year: 2006,
          description: 'In a world where ash falls from the sky, a street urchin discovers she has the power of Allomancy and joins a plot to overthrow an immortal tyrant.',
          cover: './assets/books/mistborn.jpg',
          available: 8,
          total: 12,
          trending: true
        },
        {
          id: 38,
          title: 'Red, White & Royal Blue',
          author: 'Casey McQuiston',
          genre: 'Romance',
          year: 2019,
          description: 'What happens when the First Son of the United States falls in love with the Prince of Wales? A diplomatic crisis and a secret love story.',
          cover: './assets/books/rwrb.jpg',
          available: 9,
          total: 15,
          trending: true
        }
      ];
      localStorage.setItem('books', JSON.stringify(sampleBooks));
    }

    if (!localStorage.getItem('users')) {
      const sampleUsers = [
        {
          id: 1,
          email: 'admin@gmail.com',
          password: 'admin123',
          mobile_number: '09234892345',
          role: 'admin',
          name: 'Admin'
        },
        {
          id: 2,
          firstName: 'John',
          lastName: 'Doe',
          email: 'student@gmail.com',
          mobile_number: '09234898723',
          password: 'student123',
          role: 'client'
        }
      ];
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    }

    if (!localStorage.getItem('borrowings')) {
      localStorage.setItem('borrowings', JSON.stringify([]));
    }

    // --- Migration / normalization for older saved data ---
    // Ensure every borrowing has: transactionId, status, borrowedAt, dueAt, returnedAt
    const borrowings = this.getBorrowings();
    let changed = false;
    const normalized = borrowings.map((b) => {
      const nb = { ...b };
      if (!("transactionId" in nb)) {
        nb.transactionId = nb.transactionId ?? nb.id; // old records become 1-transaction-per-row
        changed = true;
      }
      if (!("status" in nb)) {
        // Old behavior: "returnedAt" meant returned; otherwise active
        nb.status = nb.returnedAt ? "returned" : "borrowed";
        changed = true;
      }
      if (!("borrowedAt" in nb)) {
        nb.borrowedAt = nb.borrowedAt ?? null;
        changed = true;
      }
      if (!("dueAt" in nb)) {
        nb.dueAt = nb.dueAt ?? null;
        changed = true;
      }
      if (!("returnedAt" in nb)) {
        nb.returnedAt = nb.returnedAt ?? null;
        changed = true;
      }
      return nb;
    });
    if (changed) {
      localStorage.setItem("borrowings", JSON.stringify(normalized));
    }
  },

  // User operations
  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  findUser(email, password) {
    return this.getUsers().find(u => u.email === email && u.password === password);
  },

  addUser(user) {
    const users = this.getUsers();
    user.id = Math.max(...users.map(u => u.id), 0) + 1;
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    return user;
  },

  // Book operations
  getBooks() {
    return JSON.parse(localStorage.getItem('books') || '[]');
  },

  getBookById(id) {
    return this.getBooks().find(b => b.id === id);
  },

  getTrendingBooks(limit = 10) {
    return this.getBooks().filter(b => b.trending).slice(0, limit);
  },

  getGenreBooks(genre, limit = 10) {
    return this.getBooks().filter(b => b.genre && b.genre.includes(genre))
    .slice(0, limit);
  },

  getAllBooks() {
    return this.getBooks();
  },

  updateBook(id, updates) {
    const books = this.getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
      books[index] = { ...books[index], ...updates };
      localStorage.setItem('books', JSON.stringify(books));
      return books[index];
    }
    return null;
  },

  addBook(book) {
    const books = this.getBooks();
    book.id = Math.max(...books.map(b => b.id), 0) + 1;
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    return book;
  },

  deleteBook(id) {
    const books = this.getBooks();

    const updatedBooks = books.filter(b => b.id !== parseInt(id));
    localStorage.setItem('books', JSON.stringify(updatedBooks));
    return true;
  },

  // Borrowing operations
  getBorrowings() {
    return JSON.parse(localStorage.getItem('borrowings') || '[]');
  },

  getBorrowingsByUserId(userId) {
    return this.getBorrowings().filter(b => b.userId === userId && !b.returnedAt);
  },

  borrowBook(userId, bookId, transactionId = null) {
    const borrowings = this.getBorrowings();
    const book = this.getBookById(bookId);
    
    if (!book || book.available <= 0) {
      return false;
    }

    const borrowing = {
      id: Math.max(...borrowings.map(b => b.id), 0) + 1,
      transactionId: transactionId ?? null,
      userId,
      bookId,
      status: "pending",
      borrowedAt: null,
      dueAt: null,
      returnedAt: null,
    };
    if (!borrowing.transactionId) borrowing.transactionId = borrowing.id;

    borrowings.push(borrowing);
    localStorage.setItem('borrowings', JSON.stringify(borrowings));

    // Reserve the book immediately (online request)
    this.updateBook(bookId, { available: book.available - 1 });

    return borrowing;
  },

  returnBook(borrowingId) {
    const borrowings = this.getBorrowings();
    const index = borrowings.findIndex(b => b.id === borrowingId);
    
    if (index !== -1) {
      const borrowing = borrowings[index];
      borrowing.returnedAt = new Date().toISOString();
      borrowings[index] = borrowing;
      localStorage.setItem('borrowings', JSON.stringify(borrowings));

      // Increase available count
      const book = this.getBookById(borrowing.bookId);
      this.updateBook(borrowing.bookId, { available: book.available + 1 });

      return borrowing;
    }
    return null;
  },

  // Transaction helpers (admin updates) 

  getBorrowingsByTransactionId(transactionId) {
    return this.getBorrowings().filter(b => String(b.transactionId) === String(transactionId));
  },

  // Computes overall transaction status from child rows
  // Overdue is automatic when any borrowed item is past due
  getTransactionStatus(transactionId) {
    const items = this.getBorrowingsByTransactionId(transactionId);
    if (items.length === 0) return "pending";

    const now = new Date();
    const anyBorrowed = items.some(i => i.status === "borrowed");
    const anyPending = items.some(i => i.status === "pending");
    const anyDeclined = items.some(i => i.status === "declined");
    const allDeclined = items.every(i => i.status === "declined");
    const allReturned = items.every(i => i.status === "returned");
    const anyOverdue = items.some(i =>
      i.status === "borrowed" && i.dueAt && new Date(i.dueAt) < now
    );

    if (allReturned) return "returned";
    if (allDeclined) return "declined";
    if (anyOverdue) return "overdue";
    if (anyBorrowed) return "borrowed";
    if (anyPending) return "pending";
    if (anyDeclined) return "declined";
    return "pending";
  },

  setTransactionStatus(transactionId, nextStatus) {
    const borrowings = this.getBorrowings();
    const nowIso = new Date().toISOString();

    const indices = [];
    borrowings.forEach((b, idx) => {
      if (String(b.transactionId) === String(transactionId)) indices.push(idx);
    });
    if (indices.length === 0) return false;

    // Apply status changes to every item in the transaction
    indices.forEach((idx) => {
      const b = borrowings[idx];

      if (nextStatus === "pending") {
        borrowings[idx] = { ...b, status: "pending", borrowedAt: null, dueAt: null, returnedAt: null };
        return;
      }

      if (nextStatus === "borrowed") {
        // Set dates only once (first time it becomes borrowed)
        const borrowedAt = b.borrowedAt ?? nowIso;
        const dueAt = b.dueAt ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
        borrowings[idx] = { ...b, status: "borrowed", borrowedAt, dueAt, returnedAt: null };
        return;
      }

      if (nextStatus === "declined") {
        // Declined means the online reservation is cancelled.
        // Restore stock once if it wasn't already declined/returned.
        if (b.status !== "declined" && b.status !== "returned") {
          const book = this.getBookById(b.bookId);
          if (book) this.updateBook(b.bookId, { available: book.available + 1 });
        }
        borrowings[idx] = { ...b, status: "declined", borrowedAt: null, dueAt: null, returnedAt: null };
        return;
      }

      if (nextStatus === "returned") {
        // If not previously returned, restore stock
        if (b.status !== "returned") {
          const book = this.getBookById(b.bookId);
          if (book) this.updateBook(b.bookId, { available: book.available + 1 });
        }
        borrowings[idx] = { ...b, status: "returned", returnedAt: nowIso };
        return;
      }
    });

    localStorage.setItem("borrowings", JSON.stringify(borrowings));
    return true;
  },

  // --- Per-item status update (used by admin modal) ---
  // Handles stock + dates safely per borrowing row.
  setBorrowingStatus(borrowingId, nextStatus) {
    const borrowings = this.getBorrowings();
    const idx = borrowings.findIndex(b => b.id === borrowingId);
    if (idx === -1) return false;

    const b = borrowings[idx];
    const nowIso = new Date().toISOString();

    const restoreStock = () => {
      const book = this.getBookById(b.bookId);
      if (book) this.updateBook(b.bookId, { available: book.available + 1 });
    };

    const reserveStockIfNeeded = () => {
      const book = this.getBookById(b.bookId);
      if (!book) return;
      if (book.available <= 0) return;
      this.updateBook(b.bookId, { available: book.available - 1 });
    };

    // If we are coming back from returned/declined into an active flow,
    // we should reserve stock again (best-effort).
    const wasRestored = b.status === "returned" || b.status === "declined";
    const willBeActive = nextStatus === "pending" || nextStatus === "borrowed";
    if (wasRestored && willBeActive) {
      reserveStockIfNeeded();
    }

    if (nextStatus === "pending") {
      borrowings[idx] = { ...b, status: "pending", borrowedAt: null, dueAt: null, returnedAt: null };
      localStorage.setItem("borrowings", JSON.stringify(borrowings));
      return true;
    }

    if (nextStatus === "borrowed") {
      const borrowedAt = b.borrowedAt ?? nowIso;
      const dueAt = b.dueAt ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
      borrowings[idx] = { ...b, status: "borrowed", borrowedAt, dueAt, returnedAt: null };
      localStorage.setItem("borrowings", JSON.stringify(borrowings));
      return true;
    }

    if (nextStatus === "declined") {
      // Cancel reservation: restore stock only once.
      if (b.status !== "declined" && b.status !== "returned") {
        restoreStock();
      }
      borrowings[idx] = { ...b, status: "declined", borrowedAt: null, dueAt: null, returnedAt: null };
      localStorage.setItem("borrowings", JSON.stringify(borrowings));
      return true;
    }

    if (nextStatus === "returned") {
      // Restore stock only once.
      if (b.status !== "returned") {
        restoreStock();
      }
      borrowings[idx] = { ...b, status: "returned", returnedAt: nowIso };
      localStorage.setItem("borrowings", JSON.stringify(borrowings));
      return true;
    }

    return false;
  },

  // ── Cart operations (per-user) ────────────────────────────────────────────
  // Each user's cart is stored under the key `borrowCart_<userId>` so carts are
  // fully isolated — switching accounts never leaks items between users.

  _cartKey(userId) {
    return `borrowCart_${userId}`;                              // e.g. "borrowCart_2"
  },

  getCart(userId) {
    // Returns an array of bookIds for this user
    return JSON.parse(localStorage.getItem(this._cartKey(userId)) || '[]');
  },

  addToCart(userId, bookId) {
    const cart = this.getCart(userId);
    if (cart.includes(bookId)) return cart;               // already in cart, no duplicate
    cart.push(bookId);
    localStorage.setItem(this._cartKey(userId), JSON.stringify(cart));
    return cart;
  },

  removeFromCart(userId, bookId) {
    const cart = this.getCart(userId).filter(id => id !== bookId);
    localStorage.setItem(this._cartKey(userId), JSON.stringify(cart));
    return cart;
  },

  clearCart(userId) {
    localStorage.removeItem(this._cartKey(userId));
  },

  isInCart(userId, bookId) {
    return this.getCart(userId).includes(bookId);
  },

  getCartCount(userId) {
    return this.getCart(userId).length;
  },

  // Returns full book objects for every id in this user's cart
  getCartBooks(userId) {
    return this.getCart(userId)
      .map(id => this.getBookById(id))
      .filter(Boolean);                                   // drop any stale ids
  }
};

// Initialize database on script load
export default DB;