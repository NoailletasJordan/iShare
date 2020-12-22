export const setupProfileForRedux = res => {
  const profile = {}

  //set up main section
  const {
    status,
    bio,
    company,
    location,
    website,
    social,
    skills,
    githubusername
  } = res
  if (status) profile.status = res.status
  if (bio) profile.bio = res.bio
  if (company) profile.company = res.company
  if (location) profile.location = res.location
  if (website) profile.website = res.website
  if (social) profile.social = res.social
  if (skills) profile.skills = res.skills
  if (githubusername) profile.githubUsername = res.githubusername

  //set up exp
  profile.experience = res.experience

  //set edu
  profile.education = res.education

  return profile
}
