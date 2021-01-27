import React, { Fragment, useState } from "react"
import {
	makeStyles,
	Avatar,
	Popper,
	Paper,
	ClickAwayListener,
	List,
	ListItem,
	ListItemText,
} from "@material-ui/core"
import {
	Typography,
	Toolbar,
	AppBar,
	Button,
	Box,
	Portal,
	Hidden,
} from "@material-ui/core"
import DonutLargeIcon from "@material-ui/icons/DonutLarge"
import { Link, withRouter } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { userLogout } from "../../actions/user"

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
	},
	logo: {
		cursor: "pointer",
	},
	title: {
		marginRight: "auto",
		cursor: "pointer",
		paddingRight: theme.spacing(2),
		paddingLeft: theme.spacing(2),
	},
	button: {
		textTransform: "capitalize",
		fontSize: "18px",
		marginLeft: "1rem",
	},
}))

const styles = {
	avatar: {
		marginLeft: "1rem",
		cursor: "pointer",
	},
	popover: {
		marginTop: "33px",
		position: "absolute",
		right: "1rem",
		minWidth: "200px",
		backgroundColor: "white",
	},
}

function ButtonAppBar(props) {
	const classes = useStyles()
	const dispatch = useDispatch()
	const { id } = useSelector(state => state.user)
	const hasProfile = Boolean(useSelector(state => state.profile.skills).length)

	const handleBackToMenu = () => props.history.push("/developers")

	const handleRedirect = link => props.history.push(link)

	const handleLogout = () => {
		dispatch(userLogout())

		//remove the localStorage token
		window.localStorage.removeItem("social-dev-app__token")
	}

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Box mr="auto" display="flex" alignItems="center">
						<DonutLargeIcon
							className={classes.logo}
							onClick={handleBackToMenu}
						/>
						<Hidden xsDown>
							<Typography
								component="div"
								onClick={handleBackToMenu}
								className={classes.title}
							>
								<h2>IShare</h2>
							</Typography>
						</Hidden>
					</Box>

					<Menu
						handleRedirect={handleRedirect}
						handleLogout={handleLogout}
						userId={id}
						hasProfile={hasProfile}
						classes={classes}
					/>
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default withRouter(ButtonAppBar)

const Menu = ({
	handleRedirect,
	handleLogout,
	userId,
	hasProfile,
	classes,
}) => {
	const [anchorEl, setAnchorEl] = useState(null)
	const { isLogged, avatar } = useSelector(state => state.user)
	const open = Boolean(anchorEl)
	const container = React.useRef(null)

	const handleClickPopover = event => {
		setAnchorEl(event.currentTarget)
	}

	const handleClosePopover = () => {
		setAnchorEl(null)
	}

	if (isLogged & hasProfile) {
		//logged and profile
		return (
			<Fragment>
				<Button
					className={classes.button}
					component={Link}
					to="/posts"
					color="inherit"
				>
					Forum
				</Button>
				<Button
					className={classes.button}
					component={Link}
					to="/developers"
					color="inherit"
				>
					Developers
				</Button>
				<div style={styles.paper} ref={container}></div>
				<Hidden xsDown>
					<Button
						className={classes.button}
						component={Link}
						to="/dashboard"
						color="inherit"
					>
						Dashboard
					</Button>
				</Hidden>
				<Avatar
					alt="Remy Sharp"
					src={avatar ? avatar : ""}
					style={styles.avatar}
					onClick={handleClickPopover}
				/>

				<Popper open={open} anchorEl={anchorEl} style={{ zIndex: "10000" }}>
					<Portal container={container.current}>
						<Paper style={styles.popover}>
							<ClickAwayListener onClickAway={handleClosePopover}>
								<Typography component="div" onClick={handleClosePopover}>
									<List component="nav" aria-label="main mailbox folders">
										<ListItem
											button
											onClick={() => handleRedirect("/dashboard")}
										>
											<ListItemText primary="Dashboard" />
										</ListItem>

										<ListItem
											button
											onClick={() => handleRedirect("/profile/" + userId)}
										>
											<ListItemText primary="Your profile Page" />
										</ListItem>
										<ListItem
											button
											onClick={() => handleRedirect("/create-profile")}
										>
											<ListItemText primary="Edit Profile" />
										</ListItem>
										<ListItem
											button
											onClick={() => handleRedirect("/add-experience")}
										>
											<ListItemText primary="Add Experience" />
										</ListItem>
										<ListItem
											button
											onClick={() => handleRedirect("/add-education")}
										>
											<ListItemText primary="Add Education" />
										</ListItem>
										<ListItem button onClick={handleLogout}>
											<ListItemText primary="Logout" />
										</ListItem>
									</List>
								</Typography>
							</ClickAwayListener>
						</Paper>
					</Portal>
				</Popper>
			</Fragment>
		)
	} else if (isLogged & !hasProfile) {
		//logged no profile
		return (
			<Fragment>
				<Button
					className={classes.button}
					component={Link}
					to="/posts"
					color="inherit"
				>
					Forum
				</Button>
				<Button
					className={classes.button}
					component={Link}
					to="/developers"
					color="inherit"
				>
					Developers
				</Button>
				<div style={styles.paper} ref={container}></div>
				<Hidden xsDown>
					<Button
						className={classes.button}
						component={Link}
						to="/create-profile"
						color="inherit"
					>
						Create a Profile
					</Button>
				</Hidden>
				<Avatar
					alt="Remy Sharp"
					src={avatar ? avatar : ""}
					style={styles.avatar}
					onClick={handleClickPopover}
				/>

				<Popper open={open} anchorEl={anchorEl} style={{ zIndex: "10000" }}>
					<Portal container={container.current}>
						<Paper style={styles.popover}>
							<ClickAwayListener onClickAway={handleClosePopover}>
								<Typography component="div" onClick={handleClosePopover}>
									<List component="nav" aria-label="main mailbox folders">
										<ListItem
											button
											onClick={() => handleRedirect("/create-profile")}
										>
											<ListItemText primary="Create a Profile" />
										</ListItem>
										<ListItem button onClick={handleLogout}>
											<ListItemText primary="Logout" />
										</ListItem>
									</List>
								</Typography>
							</ClickAwayListener>
						</Paper>
					</Portal>
				</Popper>
			</Fragment>
		)
	} else {
		//not logged
		return (
			<Fragment>
				<Button
					className={classes.button}
					component={Link}
					to="/posts"
					color="inherit"
				>
					Forum
				</Button>
				<Button
					className={classes.button}
					component={Link}
					to="/developers"
					color="inherit"
				>
					Developers
				</Button>
				<Hidden xsDown>
					<Button
						className={classes.button}
						component={Link}
						to="/register"
						color="inherit"
					>
						Register
					</Button>
				</Hidden>
				<Button
					className={classes.button}
					component={Link}
					to="/login"
					color="inherit"
				>
					Login
				</Button>
			</Fragment>
		)
	}
}
