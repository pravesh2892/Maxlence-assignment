import axios from "axios";
import { useCallback, useEffect, useRef, useState, useContext } from "react";
import { Link,  useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import styles from "./styles.module.css";
import logo from "../../images/logo1.png"
import MyContextProvider, { MyContext } from '../../utils/MyContext';

const API_URL = "https://api.unsplash.com/search/photos";
const API_URL_key = "eiDtxHn17pKoHmf7n1oipoFNfcJDwwg5IeXI8vfjQJo";

const Main = () => {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const { name, surname, email } = useContext(MyContext);

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem("user");
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage));
    }
  }, []);

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("");
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=30&client_id=${API_URL_key}`
        );
        setImages((prevImages) => [...prevImages, ...data.results]);
        setHasMore(data.results.length > 0);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setImages([]);
    fetchImages();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    setPage(1);
    setImages([]);
    fetchImages();
  };

 

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    window.location.reload();
  };


  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <img className={styles.logo} src={logo} alt="logo" />
        
        <button className={styles.nav_menu} onClick={()=>{navigate('/user')}}>
        Registered user</button>
       
        <div className={styles.search_section}>
          <Form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="🔍 Type something to search..."
              className={styles.search_input}
              ref={searchInput}
            />
          </Form>
        </div>
       
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className={styles.container}>
        {errorMsg && <p className={styles.error_msg}>{errorMsg}</p>}
       
        <div className={styles.filters}>
          <div onClick={() => handleSelection("nature")}>Nature</div>
          <div onClick={() => handleSelection("birds")}>Birds</div>
          <div onClick={() => handleSelection("cats")}>Cats</div>
          <div onClick={() => handleSelection("shoes")}>Shoes</div>
        </div>
        {loading ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <>
            <div className={styles.images}>
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.urls.small}
                  alt={image.alt_description}
                  className={styles.image}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Main;
