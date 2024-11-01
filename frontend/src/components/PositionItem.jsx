import { Link } from "react-router-dom";

const PositionItem = ({ position }) => {
  return (
    <div className="relative overflow-hidden h-96 w-full rounded-lg group">
      <Link to={"/election" + position.href}>
        <div className="w-full h-full cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10" />
          <img
            src={position.imageUrl}
            alt={position.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h3 className="text-yellow-300 text-3xl font-bold mb-2">
              {position.name}
            </h3>
            <p className="text-yellow-100 text-sm">Explore {position.name}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PositionItem;
