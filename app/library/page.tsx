"use client";

import { useState } from "react";
import { Search, BookOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { libraryBooks, type LibraryBook } from "@/lib/mock/library";

export default function LibraryPage() {
  const [query, setQuery] = useState("");

  const filteredBooks = libraryBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Library Intelligence</h1>
        <p className="text-gray-400">
          Browse books, track availability, and manage due dates
        </p>
      </header>

      {/* Search Section */}
      <div className="search-surface w-full p-2 rounded-full border border-white/10 bg-[#1a1a1a]/50 backdrop-blur-md flex items-center gap-3">
        <Search className="w-5 h-5 text-[#c9a86a] ml-3" />
        <input
          type="text"
          placeholder="Search books, authors, or categories..."
          className="w-full bg-transparent border-none outline-none text-white placeholder:text-gray-500 py-2 pr-4"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div key={book.id} className="card p-6 border border-white/10 rounded-[18px] bg-[#1a1a1a]/40 backdrop-blur-sm hover:border-[#c9a86a]/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#c9a86a]/10 rounded-lg text-[#c9a86a]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/5 text-gray-300">
                  {book.category}
                </span>
              </div>

              <h3 className="text-lg font-medium text-white mb-1 truncate">{book.title}</h3>
              <p className="text-sm text-gray-400 mb-6">{book.author}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                {book.available ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Checked Out</span>
                  </div>
                )}
                
                {book.dueDate && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {book.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-400">No books found</p>
          <p className="text-sm text-gray-600">Try adjusting your search keywords.</p>
        </div>
      )}
    </div>
  );
}