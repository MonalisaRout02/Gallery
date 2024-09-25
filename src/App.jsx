import { useEffect, useState } from "react";
import axios from "axios";

// Modal component
function Modal({ imageUrl, closeModal }) {
  return (
    <div style={styles.modalOverlay} onClick={closeModal}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged view" style={{ width: "50%" }} />
        <button style={styles.closeButton} onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [modalImage, setModalImage] = useState(null); // State to manage the modal image
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://jsonplaceholder.typicode.com/photos"
        );

        // Group the data by albumId
        const groupedData = res.data.reduce((acc, element) => {
          const { albumId } = element;

          if (!acc[albumId]) {
            acc[albumId] = [];
          }
          acc[albumId].push(element);
          return acc;
        }, {});

        setData(groupedData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  // Toggle the selected album
  function handleAlbumClick(albumId) {
    setSelectedAlbum(selectedAlbum === albumId ? null : albumId);
  }

  // Open the modal with the selected image
  function handleImageClick(imageUrl) {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  }

  // Close the modal
  function closeModal() {
    setIsModalOpen(false);
    setModalImage(null);
  }

  return (
    <div>
      <h1>Album Thumbnails</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Object.keys(data).map((albumId) => (
          <div key={albumId}>
            <img
              src={data[albumId][0].thumbnailUrl}
              alt={`Album ${albumId}`}
              style={{ cursor: "pointer", width: "150px" }}
              onClick={() => handleAlbumClick(albumId)} // Clicking shows all album images
            />
            <p>Album {albumId}</p>

            {selectedAlbum === albumId && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {data[albumId].map((photo) => (
                  <div key={photo.id}>
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      style={{ width: "100px", cursor: "pointer" }}
                      onClick={() => handleImageClick(photo.url)} // Open modal on image click
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal rendering */}
      {isModalOpen && (
        <Modal imageUrl={modalImage} closeModal={closeModal} />
      )}
    </div>
  );
}

export default App;

// Styles for the modal
const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    position: "relative",
    width: "80%",
    maxWidth: "800px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "50%",
    cursor: "pointer",
  },
};
