import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

// My react hook getting username from router params
// I don't need a hook in this case, but I'll make one anyway, because it looks cool
// its the most simple react hook ever, technically it's not even a hook 
function useUsername() {
  const url = new URL(window.location.href)
  const username = url.pathname.split('/')[1]
  return username
}
function App() {
  const [count, setCount] = useState(0)
  const paramUsername = useUsername()
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState<FormDataEntryValue | null>(paramUsername);
  const [activity, setActivity] = useState<any[]>([]);
  // loading state  
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setUsername(new FormData(e.target as HTMLFormElement).get("username"))
  }

  useEffect(() => {
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
          </div>
          <br />
          <div className='activity-section-body'>
            {loading ? <div>Loading...</div> :
              activity.map((item: any) => {
                return (
                  <div className="activity-item">
                    <div className={item.type === "CreateEvent" ? "activity-item-new" : "activity-item-old"}>
                      <div className="activity-item-header">
                        <div className="item-type">
                          {item.type}
                        </div>
                        <p className='time-stamp'>
                          {new Date(item.created_at).toDateString()}
                        </p>
                        <div className="item-repo">
                          <a className='item-repo-link' href={"https://github.com/" + item.repo.name}>{item.repo.name}</a>
                        </div>
                        {
                          item.type === "PushEvent" ?
                            <div className="item-commit">
                              Related Commits
                              {
                                item.payload.commits.map((commit: any, index: any) => {
                                  return (
                                    <div className="item-commit-item">
                                      <div className="item-commit-item-message">
                                        {index + 1} ➡️  {commit.message}
                                      </div>
                                      {/* <div className="item-commit-item-author">
                                        {commit.author.name}
                                      </div> */}
                                    </div>
                                  )
                                }
                                )}
                            </div> :
                            ""
                        }
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
        Made By Vedik Dev - <a href="https://github.com/himanshurajora" className='footer-link'>Himanshu Jangid</a>
      </div>
    </div>
  )
}

export default App
