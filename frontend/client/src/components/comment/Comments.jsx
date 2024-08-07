import { apiDeleteComment, apiGetComments } from "@/apis/comment"
import { Fragment, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Comment from "./Comment"
import { render } from "@/redux/commentSlice"
import WithBaseTopping from "@/hocs/WithBaseTopping"
import { toast } from "react-toastify"

const Comments = ({ dispatch }) => {
  const { pid } = useParams()
  const [comments, setComments] = useState([])
  const { updateComments } = useSelector((s) => s.comment)
  const [replies, setReplies] = useState([])
  const [update, setUpdate] = useState(false)
  const fetchComments = async () => {
    const response = await apiGetComments(pid)
    if (response) {
      setComments(response.data)
      setUpdate(!update)
    }
  }
  useEffect(() => {
    fetchComments()
  }, [pid, updateComments])
  const handleReplies = (commentId) => {
    if (replies.some((el) => el === commentId))
      setReplies((prev) => prev.filter((el) => el !== commentId))
    else setReplies((prev) => [...prev, commentId])
  }
  const handleDeleteComment = async (commentId) => {
    const response = await apiDeleteComment({ commentId })
    if (response.success) {
      toast.success(response.message)
      dispatch(render())
    } else toast.error(response.message)
  }
  return (
    <div className="flex flex-col gap-4">
      {comments?.map((el, _, self) => (
        <Fragment key={el.commentPostId}>
          {!el.parentComment && (
            <Comment
              parents={self.filter(
                (cmt) => +cmt.parentComment === +el.commentPostId
              )}
              handleReplies={(commentId) => handleReplies(commentId)}
              replies={replies}
              {...el}
              parentCommentId={el.commentPostId}
              handleDeleteComment={handleDeleteComment}
              update={update}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}

export default WithBaseTopping(Comments)
