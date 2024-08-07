import { Card, Title } from "@/components"
import React from "react"
import { useSelector } from "react-redux"

const Wishlist = () => {
  const { wishlist } = useSelector((s) => s.user)
  return (
    <div>
      <Title title="Danh sách yêu thích"></Title>
      <div className="p-4 mt-3 grid grid-cols-4 gap-4">
        {wishlist?.map((el) => (
          <Card
            isLike={wishlist?.some((n) => n.id === el.id)}
            {...el}
            key={el.id}
          />
        ))}
      </div>
    </div>
  )
}

export default Wishlist
