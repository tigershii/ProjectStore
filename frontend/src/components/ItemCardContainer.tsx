import ItemCard from "./ItemCard";

export default function ItemCardContainer() {
    return (
        <div className="grid grid-cols-4 gap-4 py-4 px-6">
            {[...Array(8)].map((_, index) => (
                <ItemCard 
                key={index}
                id={index}
                title={`Air Jordan 5 Black Metallic Reimagined OG Retro 2025 ed. HF3975-001`}
                price={9.99 + index}
                image="/moon.svg"
                />
            ))}
        </div>
    )
}
