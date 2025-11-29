import { getCommitUrl } from "../utils"

export default function PushEvent(props: any) {
    const commits = props.item.payload.commits;
    const head = props.item.payload.head;
    const repoName = props.item.repo.name;

    return (
        <div className="item-commit">
            {commits && commits.length > 0 ? (
                <>
                    Related Commits
                    {commits.map((commit: any, index: any) => {
                        return (
                            <div key={index} className="item-commit-item">
                                <div className="item-commit-item-message">
                                    {index + 1} ➡️ <a href={getCommitUrl(repoName, commit.sha)} target={"_blank"} > {commit.message}</a>
                                </div>
                            </div>
                        )
                    })}
                </>
            ) : head ? (
                <>
                    Latest Commit
                    <div className="item-commit-item">
                        <div className="item-commit-item-message">
                            ➡️ <a href={getCommitUrl(repoName, head)} target={"_blank"}>View commit {head.slice(0, 7)}</a>
                        </div>
                    </div>
                </>
            ) : (
                <div>No commit details available</div>
            )}
        </div>
    )
}