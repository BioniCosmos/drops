import { GitHub } from 'arctic'

let _github: GitHub

export function github() {
  if (!_github) {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      throw Error('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET not found')
    }
    _github = new GitHub(
      process.env.GITHUB_CLIENT_ID,
      process.env.GITHUB_CLIENT_SECRET,
      null,
    )
  }
  return _github
}
