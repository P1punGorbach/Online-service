import Slider from "react-slick";
import "./SliderCarousel.css";
// в начале SliderCarousel.jsx
const Card = () => (
  <div
    style={{
      width: '150px',       // ширина карточки
      height: '200px',      // высота карточки
      backgroundColor: '#ddd',
      borderRadius: '4px',
      margin: '0 10px',
      flexShrink: 0         // чтобы в слайдере не «сжималась»
    }}
  />
);

export default function CatalogSlider({ items }) {
  const settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="catalog-slider">
      <Slider {...settings}>
        {items.map(item => (
          <div className="catalog-slider__slide" key={item.id}>
            {/* Ваша карточка */}
            <Card data={item} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
