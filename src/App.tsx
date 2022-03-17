import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { getActivityClass, getCommitUrl } from './utils'
import { IGithubEvent } from './types'
import PushEvent from './components/PushEvent'
import PullRequest from './components/PullRequest'


declare interface IUserData {
  repos: number
  gists: number
  followers: number
  following: number
}
// My react hook getting username from router params
// I don't need a hook in this case, but I'll make one anyway, because it looks cool
// its the most simple react hook ever, technically it's not even a hook 
function useUsername() {
  const url = new URL(window.location.href)
  const username = url.pathname.split('/')[1]
  return username
}
function App() {
  const [userData, setUserData] = useState<IUserData>();
  const paramUsername = useUsername()
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState<FormDataEntryValue | null>(paramUsername);
  const [activity, setActivity] = useState<IGithubEvent[]>([]);
  // loading state  
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setUsername(new FormData(e.target as HTMLFormElement).get("username"))
  }

  const renderActivity = (item: any) => {
    switch (item.type) {
      case 'PushEvent':
        return <PushEvent item={item} />
      case 'PullRequestEvent':
        return <PullRequest item={item} />
      default:
        break;
    }

  }

  useEffect(() => {
    // fetch user events
    if (username) {
      setLoading(true);
      fetch("https://api.github.com/users/" + username + "/events")
        .then(res => res.json()
          .then(data => {
            if (data.message === "Not Found") {
              setMessage("User not found")
            } else {
              setMessage("")
              data ? setActivity(data) : setActivity([])
            }
          })
          .catch(err => console.log(err)))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))

      // fetch user data
      const response = fetch("https://api.github.com/users/" + username)
        .then(res => res.json()
          .then((data: any) => {
            if (data.message === "Not Found") {
              setMessage("User not found")
            } else {
              setMessage("")
              const userData: IUserData = {
                repos: data.public_repos,
                gists: data.public_gists,
                followers: data.followers,
                following: data.following,
              }

              setUserData(userData)
            }
          }));
    }
  }, [username])

  return (
    <div className="App">
      <div className="heading">
        <abbr title='Stare At Gits Without Loading Entire Github Page'><b>Git Stare 🥸</b></abbr>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Enter Username...' autoComplete={"none"} name='username' className="search" />
        <input type='submit' className="search-button" value={"Search"} />
      </form>
      <div>
        <div className="activity-section">
          <div className="activity-section-header">
            {
              activity.length ?
                <img src={activity[0].actor["avatar_url"]} className="avatar" alt="Profile" />
                :
                <></>
            }
            <br />
            {
              message ?
                message :
                "Most Recent Activity of " + username
            }
            <br />
            {
              // show repos, gists, followers, following
              userData ?
                <div className="grid">
                  <div className="grid-item">
                    <span><a target={"_blank"} href={`https://github.com/${username}?tab=repositories`
                    } className='user-data-link'>Repos</a>: {userData.repos}</span>
                  </div>
                  <div className="grid-item">
                    <span><a target={"_blank"} href={`https://gist.github.com/${username}`} className='user-data-link'>Gists</a>: {userData.gists}</span>
                  </div>
                  <div className="grid-item">
                    <span><a target={"_blank"} href={`https://github.com/${username}?tab=following`} className='user-data-link'>Following</a>: {userData.following}</span>
                  </div>
                  <div className="grid-item">
                    <span><a target={"_blank"} href={`https://github.com/himanshurajora?tab=followers`} className='user-data-link'>Followers</a>: {userData.followers}</span>
                  </div>
                </div> : <></>
            }
          </div>
          <br />
          <div className='activity-section-body'>
            {loading ? <div>Loading...</div> :
              activity.map((item: any, index: number) => {
                return (
                  <div className="activity-item" key={index}>
                    <div className={getActivityClass(item.type)}>
                      <div className="activity-item-header">
                        <div className="item-type">
                          {item.type}
                        </div>
                        <p className='time-stamp'>
                          {new Date(item.created_at).toDateString()}
                        </p>
                        <div className="item-repo">
                          <a target={"_blank"} className='item-repo-link' href={"https://github.com/" + item.repo.name}>{item.repo.name}</a>
                        </div>
                        {renderActivity(item)}
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className="footer">
        Made By Vedik Dev - <a target={"_blank"} href="https://github.com/himanshurajora" className='footer-link'>Himanshu Jangid</a>
      </div>
    </div>
  )
}

export default App
