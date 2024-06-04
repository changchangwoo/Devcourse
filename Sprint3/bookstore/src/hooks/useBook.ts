import { useEffect, useState } from "react";
import { BookDetail } from "../models/book.model";
import { fetchBook, likeBook, unlikeBook } from "../api/books.api";
import { useAuthStore } from "../store/authStore";
import { useAlert } from "./useAlert";
import { addCart } from "../api/carts.api";

export const useBook = (bookId: string | undefined) => {
  // 권한 확인
  const { isloggedIn } = useAuthStore();
  const {showAlert} = useAlert();
  const [cartAdded, setCartAdded] = useState<boolean>(false);

  const [book, setBook] = useState<BookDetail | null | undefined>(null);
  const likeToggle = () => {
    if (!isloggedIn) {
      showAlert("로그인이 필요합니다.");
      return;
    }
    if (!book) return;
    if (book.liked) {
      // 라잌 상태 => 언 라잌 실행
      unlikeBook(book.id).then(() => {
        setBook({
          ...book,
          liked: false,
          likes: book.likes - 1,
        });
      });
    } else {
      // 언 라잌 상태 => 라잌 실행
      likeBook(book.id).then(() => {
        // 성공 처리
        setBook({
          ...book,
          liked: true,
          likes: book.likes + 1,
        });
      });
    }
  };
  useEffect(() => {
    if (!bookId) return;
    fetchBook(bookId).then((book) => setBook(book));
  }, []);

  const addToCart = (quantity: number) => {
    if (!book) return;
    addCart({
      book_id: book.id,
      quantity: quantity,
    }).then(() => {
      showAlert("장바구니에 추가되었습니다.");
      setCartAdded(true);
      setTimeout(() => {
        setCartAdded(false);
      }, 3000);
    });
  };

  return { book, likeToggle, addToCart, cartAdded };
};