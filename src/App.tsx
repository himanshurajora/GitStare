import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [username, setUsername] = useState<FormDataEntryValue | null>("");
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
          .then(data => setActivity(data))
          .catch(err => console.log(err)))
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
      console.log(activity)
    }
  }, [username])

  return (
    <div className="App">
      <div className="heading">
        <u><b>Git Stare</b></u>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Enter Username...' name='username' className="search" />
        <input type='submit' className="search-button" value={"Search"} />
      </form>
      <div>
        <div className="activity-section">
          <div className="activity-section-header">
            Most Recent Activity of {username}
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
                        <div className="item-repo">
                          <a className='item-repo-link' href={"https://github.com/" + item.repo.name}>{item.repo.name}</a>
                        </div>
                        {
                          item.type === "PushEvent" ?
                            <div className="item-commit">
                              {
                                item.payload.commits.map((commit: any, index: any) => {
                                  return (
                                    <div className="item-commit-item">
                                      Related Commits
                                      <div className="item-commit-item-message">
                                       `Commit {index + 1} Message`` :  {commit.message}
                                      </div>
                                      <div className="item-commit-item-author">
                                        {commit.author.name}
                                      </div>
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
    </div>
  )
}

export default App
