import React, { useEffect } from "react"
import Button from "../common/Button"
import { CiSearch } from "react-icons/ci"
import { useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import withBaseTopping from "@/hocs/WithBaseTopping"
import { modal } from "@/redux/appSlice"
import path from "@/ultils/path"
import { createSearchParams } from "react-router-dom"
import { BiReset, BiDollar } from "react-icons/bi"
import SearchRange from "./SearchRange"
import SearchAddress from "./SearchAddress"
import SearchNameSupplier from "./SearchNameSupplier"
import { InputForm } from ".."


const Search = ({ dispatch, navigate, location }) => {


  const { setValue, watch, register, formState: { errors } } = useForm()
  const nameSupplier = watch("nameSupplier")
  const address = watch("address")
  useEffect(() => {
    if (location.pathname === "/") reset()
  }, [location.pathname])
  const reset = () => {
    setValue("nameSupplier", "")
    setValue("address", "")
  }

  const handleSearchPost = () => {
    const queries = {}
    if (nameSupplier) queries.name = nameSupplier
    if (address) queries.address = address

    navigate({
      pathname: `/${path.LIST}`,
      search: createSearchParams(queries).toString(),
    })
  }
  return (
    <div className="w-full h-[500px] bg-cover bg-center bg-[url('https://zexy.net/contents/images/generaltop/bg_kv_01.jpg')] flex items-center justify-start">
      <div className="w-full max-w-4xl p-12">
        <div className="w-full max-w-md mx-auto p-4 rounded-md flex flex-col gap-10" style={{ backgroundColor: 'rgba(254, 241, 241, .65)' }}>
          <div className="text-pink-500 flex justify-center">
            <span className="text-center text-xl italic">Tìm Địa Điểm Tổ Chức Đám Cưới</span>
          </div>
          <div
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <SearchAddress getAddress={(val) => setValue("address", val)} />
                  ),
                })
              )
            }
            className="col-span-1 p-2 rounded-[0.25rem] line-clamp-1 w-full flex items-center cursor-pointer text-gray-500 bg-white"
          >
            <span className="line-clamp-1">{address || "🚩 Địa chỉ"}</span>
          </div>
          <div
            className="col-span-1 p-2 rounded-[0.25rem] flex items-center cursor-pointer text-gray-500 bg-white"
            onClick={() =>
              dispatch(
                modal({
                  isShowModal: true,
                  modalContent: (
                    <SearchNameSupplier
                      getValue={(val) => setValue("nameSupplier", val)}
                      valRange={nameSupplier?.value}
                      typeCode="NAME"
                    />
                  ),
                })
              )
            }
          >
            <span className="line-clamp-1">
              {nameSupplier || "📛 Tên nhà cung cấp"}
            </span>
          </div>

          <div className="col-span-1 h-full flex items-center justify-center gap-2">
            <Button className="flex-auto h-full" onClick={handleSearchPost}>
              <CiSearch size={18} />
              <span>Tìm kiếm</span>
            </Button>
            <Button className="bg-red-500 h-full flex-auto" onClick={reset}>
              <BiReset color="white" size={18} />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withBaseTopping(Search)
