import React from "react";

interface IPriceProps {
    price: number;
}

const Price = ( {price}: IPriceProps) => {
    return (
        <div className="price">
            <span>QFI: ${price}</span>
        </div>
    )
}

export default Price;