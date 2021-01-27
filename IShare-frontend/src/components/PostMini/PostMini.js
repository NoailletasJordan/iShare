import React, { useState } from "react"
import { Box, makeStyles, Button, Paper, Grid } from "@material-ui/core"
import ThumbUpIcon from "@material-ui/icons/ThumbUp"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import { withRouter, Link } from "react-router-dom"
import { openSnackbar } from "../../actions/snackbar"
import { useSelector, useDispatch } from "react-redux"
import { ajaxFunction } from "../../fetch"

// provide boolean(author)
const useStyles = makeStyles(theme => ({
	post: {
		minHeight: "175px",
		padding: "16px 16px 16px 0 !important",
		overflow: "hidden",
		[theme.breakpoints.down("xs")]: {
			padding: "16px 8px",
		},
	},
	image: {
		height: "80px",
		width: "80px",
		borderRadius: "50%",
		backgroundSize: "cover",
		backgroundPosition: "center",
		display: "flex",
		justifyContent: "center",
		cursor: "pointer",
	},
	buttonLine: {
		display: "flex",
		flexWrap: "wrap",
	},
	buttonDiscussion: {
		backgroundColor: theme.palette.info.main,
		textTransform: "capitalize",
		"&:hover": {
			backgroundColor: theme.palette.info.dark,
		},
	},
	buttonDelete: {
		background: theme.palette.error.light,
		textTransform: "capitalize",
		color: "white",
		"&:hover": {
			background: theme.palette.error.main,
		},
	},
	link: {
		color: "inherit",
		textDecoration: "none",
		"&:hover": {
			textDecoration: "underline",
		},
	},
}))

const PostMini = props => {
	const dispatch = useDispatch()
	const { isLogged, token } = useSelector(state => state.user)
	const [allowClick, setAllowClick] = useState(true)

	const handleRedirectToUserProfile = userId =>
		props.history.push(`/profile/${userId}`)

	const handleLikeOrUnlike = async () => {
		//if not logged
		if (!isLogged)
			return dispatch(openSnackbar(false, "custom", "Log in to like a post"))

		if (!allowClick) return //prevent spamclick
		setAllowClick(false)

		if (!props.isLiked) {
			//like
			//name nesting
			const { err, data } = await ajaxFunction(
				"PUT",
				`/api/posts/like/${props._id}`,
				false,
				token
			)
			setAllowClick(true) // allow click
			if (err) return console.log(err.message) //error
			//update state
			props.updatePostLikes(data)
		} else {
			//unlike
			const { err, data } = await ajaxFunction(
				"PUT",
				`/api/posts/unlike/${props._id}`,
				false,
				token
			)
			setAllowClick(true) // allow click
			if (err) return console.log(err.message) //error
			//update state
			props.updatePostLikes(data)
		}
	}

	const handleClickDiscussion = postId => {
		//
		props.history.push(`/post/${postId}`)
	}

	//convert dates
	const convertDate = timestampString => {
		const date = new Date(timestampString)
		const options = {
			year: "numeric",
			month: "numeric",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		}
		return date.toLocaleDateString("fr-FR", options).replace("à", "-")
	}

	const shortenText = text => {
		if (text.length < 250) return text
		return text.slice(0, 250) + "..."
	}

	const classes = useStyles()
	return (
		<Paper
			className={classes.post}
			elevation={3}
			style={{ display: "flex", alignItems: "stretch" }}
		>
			<Grid container justify="space-between">
				<Grid item md={2} sm={3} xs={4}>
					<Box
						display="flex"
						alignItems="center"
						flexDirection="column"
						mt="12px"
					>
						<div
							className={classes.image}
							onClick={() => handleRedirectToUserProfile(props.user)}
							style={{ backgroundImage: `url(${props.avatar})` }}
						/>
						<Box component="p" mt={0.5} color="secondary.main">
							<Link to={`/profile/${props.user}`} className={classes.link}>
								{props.name}
							</Link>
						</Box>
					</Box>
				</Grid>

				<Grid
					item
					md={10}
					sm={9}
					xs={8}
					container
					direction="column"
					justify="space-between"
					alignItems="stretch"
				>
					<Box mb={1} component={"h3"} color="#424242">
						{props.text ? shortenText(props.title) : null}
					</Box>

					<Box
						style={{ whiteSpace: "pre-wrap" }}
						maxHeight="250px"
						overflow="hidden"
					>
						{props.text ? shortenText(props.text) : null}
					</Box>

					<Box mt={1}>
						<Box fontSize="14px" color="#bbb">
							posted on {convertDate(props.date)}
						</Box>

						<Box className={classes.buttonLine} mt={1}>
							<Box mr={1} mb={1}>
								<Button
									onClick={handleLikeOrUnlike}
									variant="contained"
									color={props.isLiked ? "primary" : "default"}
								>
									<ThumbUpIcon />
									<Box ml={0.5}>{props.likes ? props.likes.length : null}</Box>
								</Button>
							</Box>

							<Box mr={1} mb={1}>
								<Button
									onClick={() => handleClickDiscussion(props._id)}
									variant="contained"
									className={classes.buttonDiscussion}
								>
									Discussion
									<Box
										component="span"
										bgcolor="#fff"
										borderRadius="2px"
										ml={0.5}
										px="4px"
										minWidth="20px"
									>
										{props.comments.length}
									</Box>
								</Button>
							</Box>

							<Box mb={1}>
								{props.author ? (
									<Button
										onClick={props.handleDeletePost}
										variant="contained"
										className={classes.buttonDelete}
									>
										<DeleteForeverIcon />
									</Button>
								) : null}
							</Box>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	)
}

export default withRouter(PostMini)
