import moment from "moment"
import { useEffect, useState } from "react"
import { ImReply } from "react-icons/im"
import TypeBox from "./TypeBox"
import { HiOutlineDotsVertical } from "react-icons/hi"
import { useSelector } from "react-redux"
import WithBaseTopping from "@/hocs/WithBaseTopping"
const Comment = ({
  partUser,
  content,
  createdDate,
  handleReplies,
  commentPostId,
  replies,
  parents = [],
  parentCommentId,
  update,
  userId,
  handleDeleteComment,
}) => {
  // id - id của comment hiện tại
  // parentCommentId - id của parent cấp đầu
  const { current } = useSelector((s) => s.user)
  const [isShowMore, setIsShowMore] = useState(false)
  const [finalParents, setFinalParents] = useState([])
  const [isShowOption, setIsShowOption] = useState(false)
  const [isEdit, setIsEdit] = useState(false)


  useEffect(() => {
    if (!isShowMore) setFinalParents(() => parents.filter((_, idx) => idx < 1))
    else setFinalParents(parents)
  }, [isShowMore, update])

  return (
    <div className="flex gap-3">
      <img
        src={partUser?.images || "/user.svg"}
        alt="user"
        className="w-12 h-12 flex-none object-cover border rounded-full"
      />
      <div className="col-span-11 flex flex-col gap-2 relative flex-auto">
        <div className="w-full bg-gray-100 px-4 py-3 rounded-md relative">
          {!isEdit && current && (

            <span
              onClick={() => handleReplies(commentPostId)}
              title="Trả lời"
              className="text-main-blue absolute cursor-pointer hover:text-main-red bottom-3 right-3"
            >
              <ImReply size={22} />
            </span>
          )}
          <span className="flex relative mb-2 justify-between">
            <span className="text-main-blue font-medium">
              {partUser?.userName}
              <span className="font-normal text-xs italic text-gray-500">

                ({moment(createdDate).fromNow()})
              </span>
            </span>
            {current?.customerId === userId && (
              <span className="text-xl select-none cursor-pointer p-2 pr-0 relative">
                <span
                  onClick={() => setIsShowOption(!isShowOption)}
                  className="text-xl cursor-pointer"
                >
                  <HiOutlineDotsVertical />
                </span>
                {isShowOption && (
                  <span className="absolute top-0 right-full flex flex-col min-w-[100px] bg-white drop-shadow text-sm">
                    <span
                      onClick={() => {
                        setIsEdit(true)
                        setIsShowOption(false)
                      }}
                      className="p-2 hover:font-bold pb-1"
                    >
                      Chỉnh sửa
                    </span>
                    <span
                      onClick={() => handleDeleteComment(commentPostId)}
                      className="p-2 hover:font-bold pt-1"
                    >
                      Xóa
                    </span>
                  </span>
                )}
              </span>
            )}
          </span>
          {isEdit ? (
            <TypeBox
              parentComment={commentPostId}
              parentCommentId={parentCommentId}
              handleReplies={handleReplies}
              currentContent={content}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              commentPostId={commentPostId}
            />
          ) : (
            <p>{content}</p>
          )}
        </div>
        {replies.some((el) => el === commentPostId) && (
          <div className="w-full">
            <TypeBox
              parentComment={commentPostId}
              parentCommentId={parentCommentId}
              handleReplies={handleReplies}
            />
          </div>
        )}
        {finalParents?.length > 0 && (
          <div className="flex flex-col gap-2">
            {finalParents?.map((el) => (
              <Comment
                parentCommentId={parentCommentId}
                handleReplies={handleReplies}
                replies={replies}
                key={el.commentPostId}
                {...el}
                handleDeleteComment={handleDeleteComment}
              />
            ))}
            {parents?.length > 1 && (
              <span
                onClick={() => setIsShowMore(!isShowMore)}
                className="text-sm text-main-blue cursor-pointer hover:underline"
              >
                Xem thêm / Ẩn bớt
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WithBaseTopping(Comment)
