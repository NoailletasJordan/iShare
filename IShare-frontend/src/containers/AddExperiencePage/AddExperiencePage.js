import React, { useState, useRef } from "react"
import {
	Typography,
	Box,
	makeStyles,
	TextField,
	Button,
	FormControlLabel,
	Checkbox,
} from "@material-ui/core"
import ComputerIcon from "@material-ui/icons/Computer"
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from "@material-ui/pickers"
import DateFnsUtils from "@date-io/date-fns"
import { useSelector, useDispatch } from "react-redux"
import { ajaxFunction } from "../../fetch"
import { openSnackbar } from "../../actions/snackbar"
import { profileUpdate } from "../../actions/profile"

const useStyles = makeStyles(theme => ({
	createProfilePage: {
		display: "flex",
		justifyContent: "center",
	},
	subtitle: {
		display: "grid",
		gridTemplateColumns: "repeat(2,max-content)",
		gridColumnGap: "8px",
	},
	form: {
		display: "grid",
		gridTemplateColumns: "repeat(3, 32%)",
		justifyContent: "space-between",
		gridRowGap: "24px",
		marginTop: " 24px",
		[theme.breakpoints.down("xs")]: {
			gridTemplateColumns: "repeat(2, 48%)",
		},
	},
	description: {
		gridColumn: "1/ -1",
	},
	socialLinks: {
		display: "grid",
		gridRowGap: "16px",
	},
	current: {
		transform: "translateY(10%)",
	},
	picker: {
		margin: 0,
	},
}))

const AddExperiencePage = props => {
	const inputEl = useRef(null)
	const dispatch = useDispatch()
	const { isLogged, token } = useSelector(state => state.user)
	const hasProfile = Boolean(useSelector(state => state.profile.skills).length)
	const [fields, setFields] = useState({
		title: "",
		company: "",
		location: "",
		from: null,
		current: true,
		to: null,
		description: "",
	})

	const [error, setError] = useState({
		fields: [],
		message: ["", "", "", "", "", "", ""],
	})

	const handleChange = (e, specificInput) => {
		setFields({ ...fields, [specificInput]: e.target.value })
		//console.log({ ...fields, [specificInput]: e.target.value })
		//removing the error of the current field
		removeTheErrorOnChange(specificInput)
	}

	const handleDateChange = (date, specificInput) => {
		setFields({ ...fields, [specificInput]: date })

		//remove the error if there was
		removeTheErrorOnChange(specificInput)
	}

	const removeTheErrorOnChange = specificInput => {
		const index = [
			"title",
			"company",
			"location",
			"from",
			"current",
			"to",
			"description",
		].findIndex(elt => elt === specificInput)
		const newFields = error.fields.filter(elt => elt !== index)
		const newMessage = error.message
		newMessage[index] = ""
		setError({
			fields: newFields,
			message: newMessage,
		})
	}

	const handleToggleCurrent = () => {
		setFields({ ...fields, current: !fields.current, to: null })
	}

	const handleGoBack = () => props.history.goBack()

	const handleSumbit = async () => {
		//no profile
		if (!hasProfile) {
			dispatch(
				openSnackbar(false, "custom", "You need to create a profile first")
			)
			if (!isLogged) return props.history.push("/login")
			else return props.history.push("/create-profile")
		}

		//submit
		const { error, fieldsNumber, message } = checkInputValidation()
		if (error) {
			//error
			setError({
				fields: fieldsNumber,
				message,
			})
		} else {
			//set up the obj to send
			const requestBody = setUpTheObjToSend(fields)

			//send to backend
			const { err, data } = await ajaxFunction(
				"PUT",
				"/api/profile/experience",
				requestBody,
				token
			)
			if (err) return dispatch(openSnackbar(false, "custom", err.message)) //error

			//open snackbar success
			dispatch(openSnackbar(true, "custom", "Experience added"))

			//update redux
			dispatch(profileUpdate(data))

			//reset state
			setFields({
				title: "",
				company: "",
				location: "",
				from: null,
				current: true,
				to: null,
				description: "",
			})
		}
	}

	const capitalize = s => {
		if (typeof s !== "string") return ""
		return s.charAt(0).toUpperCase() + s.slice(1)
	}

	const setUpTheObjToSend = fields => {
		return {
			title: capitalize(fields.title),
			company: capitalize(fields.company),
			location: capitalize(fields.location),
			from: fields.from,
			to: fields.current ? new Date() : fields.to,
			description: fields.description,
		}
	}

	const checkInputValidation = () => {
		let error = false
		let fieldsNumber = []
		const message = ["", ""]

		if (fields.title.length <= 0) {
			error = true
			fieldsNumber = fieldsNumber.concat(0)
			message[0] = "Title required"
		}

		if (fields.company.length <= 0) {
			error = true
			fieldsNumber = fieldsNumber.concat(1)
			message[1] = "Company required"
		}

		if (fields.location.length <= 0) {
			error = true
			fieldsNumber = fieldsNumber.concat(2)
			message[2] = "Location required"
		}

		if (!(fields.from instanceof Date && !isNaN(fields.from))) {
			// is an invalid Date
			error = true
			fieldsNumber = fieldsNumber.concat(3)
			message[3] = "Pick a valid Date with the date picker"
		}

		if (!fields.current && !(fields.to instanceof Date && !isNaN(fields.to))) {
			// is an invalid Date
			error = true
			fieldsNumber = fieldsNumber.concat(5)
			message[5] = 'Pick a valid Date or check "current job"'
		} else if (
			!fields.current &&
			new Date(fields.to) <= new Date(fields.from)
		) {
			//From Date is later than To Date
			error = true
			fieldsNumber = fieldsNumber.concat(5)
			message[5] = `The "To" date cannot be earlier than the "From" one`
		}

		if (fields.description.length <= 0) {
			error = true
			fieldsNumber = fieldsNumber.concat(6)
			message[6] = "Description required"
		} else if (fields.description.length < 10) {
			error = true
			fieldsNumber = fieldsNumber.concat(6)
			message[6] = "Description too short (min 10 caracters)"
		}

		return {
			error,
			fieldsNumber,
			message,
		}
	}

	const classes = useStyles()
	return (
		<Typography component="div" className={classes.createProfilePage}>
			<Box width="95vw" maxWidth="1300px" mt={4}>
				<Box
					component="h2"
					color="secondary.main"
					fontWeight="500"
					fontSize="h4.fontSize"
					letterSpacing={5}
				>
					Add An Experience
				</Box>

				<Box component="h4" fontWeight="500" className={classes.subtitle}>
					<ComputerIcon />
					Any programming positions?
				</Box>

				<form className={classes.form}>
					<TextField
						id="standard-basic"
						label="Title "
						required
						value={fields.title}
						onChange={e => handleChange(e, "title")}
						error={error.fields.includes(0) ? true : false}
						helperText={error.fields.includes(0) ? error.message[0] : null}
					/>
					<TextField
						id="standard-basic"
						label="Company"
						required
						value={fields.company}
						onChange={e => handleChange(e, "company")}
						error={error.fields.includes(1) ? true : false}
						helperText={error.fields.includes(1) ? error.message[1] : null}
					/>

					<TextField
						id="standard-basic"
						required
						label="Location"
						value={fields.location}
						onChange={e => handleChange(e, "location")}
						error={error.fields.includes(2) ? true : false}
						helperText={
							error.fields.includes(2) ? error.message[2] : "ex: Paris, France"
						}
					/>

					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant="inline"
							margin="normal"
							id="date-picker-inline"
							views={["year", "month"]}
							className={classes.picker}
							label="From *"
							value={fields.from}
							onChange={date => handleDateChange(date, "from")}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
							error={error.fields.includes(3) ? true : false}
							helperText={
								error.fields.includes(3)
									? error.message[3]
									: "Use the date Picker"
							}
						/>
					</MuiPickersUtilsProvider>
					<Box display="flex" justifyContent="center">
						<FormControlLabel
							className={classes.current}
							control={
								<Checkbox
									checked={fields.current}
									onChange={handleToggleCurrent}
								/>
							}
							label="Current Job"
						/>
					</Box>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant="inline"
							margin="normal"
							disabled={!fields.current ? false : true}
							id="date-picker-inline"
							views={["year", "month"]}
							className={classes.picker}
							label="To"
							value={fields.to}
							onChange={date => handleDateChange(date, "to")}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
							error={error.fields.includes(5) ? true : false}
							helperText={
								error.fields.includes(5)
									? error.message[5]
									: "Use the date Picker"
							}
						/>
					</MuiPickersUtilsProvider>
					<TextField
						className={classes.description}
						id="standard-basic"
						multiline
						rows="4"
						label="Job description"
						variant="outlined"
						value={fields.description}
						onChange={e => handleChange(e, "description")}
						error={error.fields.includes(6) ? true : false}
						helperText={error.fields.includes(6) ? error.message[6] : null}
					/>
				</form>

				<Box mt={3} display="flex">
					<Box marginRight={2}>
						<Button variant="contained" color="primary" onClick={handleSumbit}>
							Sumbit
						</Button>
					</Box>
					<Button variant="contained" onClick={handleGoBack}>
						Go Back
					</Button>
				</Box>
			</Box>
		</Typography>
	)
}

export default AddExperiencePage
