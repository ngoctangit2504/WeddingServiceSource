import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import withBaseTopping from "@/hocs/WithBaseTopping";
import Button from "../common/Button";
import { modal } from "@/redux/appSlice";
import { suppliers } from "@/ultils/constant" // Import the fake data
import { apiSuppliers } from "@/apis/supplier";

const SearchNameSupplier = ({ getValue, valRange = "" }) => {
  const [selectedOption, setSelectedOption] = useState(valRange);
  const [inputValue, setInputValue] = useState('');
  const [supplier, setSupplier] = useState([])

  const dispatch = useDispatch();

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setInputValue(option);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedOption(e.target.value);
  };


  const getSupplier = async () => {
    const response = await apiSuppliers()
    if (response) setSupplier(response.data)
    else setSupplier([])
  }

  useEffect(() => {
    getSupplier() 
  }, [])



  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-[650px] bg-white rounded-md p-4"
    >
      <h1 className="text-lg font-bold tracking-tight pb-4 border-b">Tìm kiếm theo tên nhà cung cấp</h1>
      <div className="my-6 flex flex-col gap-4">
        <div className="pb-4 text-center text-lg font-bold text-pink-600">
          {selectedOption || "Chọn tên nhà cung cấp"}
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="border rounded p-2 w-full"
          placeholder="Nhập tên nhà cung cấp"
        />
        <div className="mt-4">
          <h3 className="font-semibold">Danh sách nhà cung cấp:</h3>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {supplier.map((option) => (
              <span
                key={option.logo}
                className={`col-span-1 cursor-pointer p-2 flex items-center justify-center rounded-md bg-gray-100 hover:border-emerald-600 ${selectedOption === option.name ? "border-emerald-600" : ""
                  }`}
                onClick={() => handleSelectOption(option.name)}
              >
                {option.name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => {
            dispatch(modal({ isShowModal: false, modalContent: null }));
            getValue(selectedOption);
          }}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default withBaseTopping(SearchNameSupplier);
