import { getCommitUrl } from "../utils"

export default function PullRequest(props: any) {
    console.log(props.item.payload.pull_request)
    return (
        <div className="item-commit">
            Related Commits
            <div  className="item-commit-item">
                <div className="item-commit-item-message">
                   <a target={"_blank"} href={props.item.payload.pull_request.html_url}>Watch Pull Request</a> &nbsp; &nbsp;
                   <a target={"_blank"} href={props.item.payload.pull_request.html_url + "/files"}>Watch Code Difference</a>
                </div>
            </div>
        </div>
    )
}