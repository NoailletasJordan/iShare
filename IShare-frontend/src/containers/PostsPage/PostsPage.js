import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  makeStyles,
  TextField,
  Button,
} from '@material-ui/core'
import './PostsPage.styles.scss'
import PersonIcon from '@material-ui/icons/Person'
import PostMini from '../../components/PostMini/PostMini'
import { ajaxFunction } from '../../fetch'
import { useSelector, useDispatch } from 'react-redux'
import { openSnackbar } from '../../actions/snackbar'
import { CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  saySomething: {
    backgroundColor: theme.palette.info.main,
    color: 'white',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    paddingLeft: '16px',
    borderRadius: '4px',
  },
  listPosts: {
    display: 'grid',
    gridRowGap: '16px',
  },
}))

const PostsPage = () => {
  const [postsList, setPostsList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { isLogged, id, token } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [postTitle, setPostTitle] = useState('')
  const [postField, setPostField] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    let isSubscribed = true //fix bc of the rerender
    const getAllPostsFromDatabase = async () => {
      //send to backend
      const { err, data } = await ajaxFunction('GET', '/api/posts', false)
      if (err) return console.log(err.message) //error

      //update state
      setPostsList(data)
    }
    getAllPostsFromDatabase().then(() => setIsLoading(false))
    return () => (isSubscribed = false) //fix bc of the rerender
  }, [])

  const updatePostLikes = (postId) => (newLikesList) => {
    const index = postsList.findIndex((post) => post._id === postId)
    const newList = [...postsList]
    newList[index].likes = newLikesList
    setPostsList(newList)
  }

  const handleAddPost = async () => {
    //check is logged
    if (!isLogged)
      return dispatch(openSnackbar(false, 'custom', 'Log in to create a post'))

    //check minimum - maximum caracter
    if (postField.trim().length < 10)
      return dispatch(openSnackbar(false, 'custom', 'Post too short'))

    if (postField.trim().length > 2500)
      return dispatch(openSnackbar(false, 'custom', 'Post too long'))

    if (postTitle.trim().length < 1)
      return dispatch(openSnackbar(false, 'custom', 'Title too short'))

    if (postTitle.trim().length > 250)
      return dispatch(
        openSnackbar(false, 'custom', 'Title too long - max 250 caracters')
      )

    //set up data
    const requestBody = {
      text: postField.trim(),
      title: postTitle.trim(),
    }

    //send to backend
    const { err, data } = await ajaxFunction(
      'POST',
      '/api/posts',
      requestBody,
      token
    )
    if (err) return dispatch(openSnackbar(false, 'custom', err.message)) //error

    //update state with deep copy
    const newPostsList = JSON.parse(JSON.stringify(postsList))
    newPostsList.unshift(data)
    setPostsList(newPostsList)

    //inform user
    dispatch(openSnackbar(true, 'custom', 'Post Submitted'))

    //reset state
    setPostField('')
    setPostTitle('')
  }

  const isPostLiked = (LikeArray) => {
    return Boolean(LikeArray.filter((like) => like.user === id).length)
  }

  const handleChange = (e) => setPostField(e.target.value)

  const handleChangeTitle = (e) => setPostTitle(e.target.value)

  const handleChangeSearch = (e) => setValue(e.target.value)

  const filterPost = (postsList, searchValue) => {
    //search empty
    if (!searchValue.length) return postsList

    return postsList.filter(
      (post) =>
        post.text.toLowerCase().includes(searchValue.toLowerCase()) ||
        post.title.toLowerCase().includes(searchValue.toLowerCase())
    )
  }

  const handleDeletePost = async (postId) => {
    //send to backend -- noo need data here
    const { err } = await ajaxFunction(
      'DELETE',
      `/api/posts/${postId}`,
      false,
      token
    )
    if (err) return dispatch(openSnackbar(false, 'custom', err.message)) //error

    //update state
    setPostsList(postsList.filter((post) => post._id !== postId))

    //inform user
    dispatch(openSnackbar(true, 'custom', 'Post deleted'))
  }

  const classes = useStyles()
  return (
    <Typography component="div" className="post-page">
      <div className="post-page__inner u-padding-top-32">
        <Box
          component="h2"
          color="secondary.main"
          fontWeight="500"
          fontSize="h4.fontSize"
          letterSpacing={5}
        >
          Forum
        </Box>

        <Box component="h4" fontWeight="500" className="post-page__subtitle">
          <Box display="flex">
            <PersonIcon />
            <Box component="p" ml={1} mr="auto" mb={3}>
              Welcome to the community
            </Box>
          </Box>

          <TextField
            style={{ width: 'auto', maxWidth: '500px', marginTop: '-24px' }}
            id="standard-basic"
            value={value}
            onChange={handleChangeSearch}
            label="Search"
          />
        </Box>

        <div className={classes.saySomething}>
          {isLogged ? 'Say Something...' : 'Please log in to create a post'}
        </div>

        <div className="u-margin-top-16">
          <Box mb={2} width="100%">
            <TextField
              id="standard"
              value={postTitle}
              onChange={handleChangeTitle}
              placeholder="Title"
              variant="outlined"
              disabled={isLogged ? false : true}
              fullWidth
            />
          </Box>

          <TextField
            id="standard-multiline-static"
            multiline
            value={postField}
            onChange={handleChange}
            rows="6"
            fullWidth
            placeholder="Create a post"
            variant="outlined"
            disabled={isLogged ? false : true}
          />

          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              disabled={isLogged ? false : true}
              onClick={handleAddPost}
            >
              Submit
            </Button>
          </Box>
        </div>

        {isLoading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress size={80} />
          </Box>
        ) : (
          <Box mt={3} className={classes.listPosts}>
            {!filterPost(postsList, value).length ? (
              <Box
                p={4}
                display="flex"
                justifyContent="center"
                alignContent="center"
                fontSize="h6.fontSize"
                color="secondary.main"
              >
                No post found...
              </Box>
            ) : (
              filterPost(postsList, value).map((post) => (
                <PostMini
                  key={post._id}
                  {...post}
                  author={post.user === id}
                  updatePostLikes={updatePostLikes(post._id)}
                  isLiked={isPostLiked(post.likes)}
                  handleDeletePost={() => handleDeletePost(post._id)}
                />
              ))
            )}
          </Box>
        )}
      </div>
    </Typography>
  )
}

export default PostsPage
