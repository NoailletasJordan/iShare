import React, { useState, useEffect } from 'react'
import {
  Button,
  makeStyles,
  Typography,
  Box,
  TextField
} from '@material-ui/core'
import './PostUniquePage.styles.scss'
import { Link } from 'react-router-dom'
import Comment from '../../components/Comment/Comment'
import PostUniqueCurrent from '../../components/PostUniqueCurrent/PostUniqueCurrent'
import { ajaxFunction } from '../../fetch'
import { useSelector, useDispatch } from 'react-redux'
import { openSnackbar } from '../../actions/snackbar'
import { CircularProgress } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  button: {
    background: '#eee',
    marginBottom: '16px'
  },
  saySomething: {
    backgroundColor: theme.palette.info.main,
    color: 'white',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    paddingLeft: '16px',
    borderRadius: '4px'
  },
  commentList: {
    display: 'grid',
    gridRowGap: '16px',
    marginTop: '24px'
  }
}))

const PostUniquePage = props => {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(true)
  const [postUnique, setPostUnique] = useState({})
  const { isLogged, token, id } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [commentField, setCommentField] = useState('')

  useEffect(() => {
    let isSubscribed = true //fix bc of the rerender
    const getUniquePostFromDatabase = async () => {
      //send to backend
      const { err, data } = await ajaxFunction(
        'GET',
        `/api/posts/${props.match.params.postId}`,
        false
      )
      if (err) return console.log(err.message) //error

      //update state
      setPostUnique(data)
    }
    getUniquePostFromDatabase().then(() => setIsLoading(false))

    return () => (isSubscribed = false) //fix bc of the rerender
  }, [])

  const handleChange = e => setCommentField(e.target.value)

  const handleAddComment = async () => {
    //check is logged
    if (!isLogged)
      return dispatch(openSnackbar(false, 'custom', 'Log in to comment'))

    //check minimum caracter
    if (commentField.length < 1)
      return dispatch(openSnackbar(false, 'custom', 'Post too short'))

    //set up data
    const requestBody = {
      text: commentField
    }

    //send to backend
    const { err, data } = await ajaxFunction(
      'POST',
      `/api/posts/comment/${props.match.params.postId}`,
      requestBody,
      token
    )
    if (err) return dispatch(openSnackbar(false, 'custom', err.message)) //error

    //update state
    setPostUnique({ ...postUnique, comments: data.reverse() })

    //inform user
    dispatch(openSnackbar(true, 'custom', 'Comment submitted'))

    //reset state
    setCommentField('')
  }

  const handleDeleteComment = postId => async commentId => {
    //send to backend
    const { err, data } = await ajaxFunction(
      'DELETE',
      `/api/posts/comment/${postId}/${commentId}`,
      false,
      token
    )
    if (err) return dispatch(openSnackbar(false, 'custom', err.message)) //error

    //update state
    setPostUnique({ ...postUnique, comments: data })

    //inform user
    dispatch(openSnackbar(true, 'custom', 'Comment deleted'))
  }

  return (
    <Typography component="div" className="post-unique-page">
      <div className="post-unique-page__inner  u-padding-top-32">
        <Button
          className={classes.button}
          variant="contained"
          component={Link}
          to="/posts"
        >
          Back to posts
        </Button>

        <PostUniqueCurrent {...postUnique} />

        <div className={classes.saySomething}>
          {isLogged ? 'Comment this post' : 'Please log in to comment a post'}
        </div>

        <div className="u-margin-top-16">
          <TextField
            id="standard-multiline-static"
            multiline
            rows="6"
            fullWidth
            value={commentField}
            placeholder="Create a comment"
            variant="outlined"
            disabled={isLogged ? false : true}
            onChange={handleChange}
          />

          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              disabled={isLogged ? false : true}
              onClick={handleAddComment}
            >
              Submit
            </Button>
          </Box>
        </div>

        <Box mt={3} className={classes.commentList}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" mt={5}>
              <CircularProgress size={80} />
            </Box>
          ) : (
            postUnique.comments
              .reverse()
              .map(comment => (
                <Comment
                  key={comment._id}
                  {...comment}
                  author={Boolean(id === comment.user)}
                  handleDeleteComment={handleDeleteComment(
                    props.match.params.postId
                  )}
                />
              ))
          )}
        </Box>
      </div>
    </Typography>
  )
}

export default PostUniquePage
