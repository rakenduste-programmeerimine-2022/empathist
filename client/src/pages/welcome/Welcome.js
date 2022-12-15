import { Link } from "react-router-dom"
const Welcome = () => {
  return (
    <>
      <section className="section welcome-page-section">
        <h1 className="title is-size-1 ">Welcome</h1>
        <p className="text is-size-3 my-5">We are happy to see you! </p>
        <p className="text is-size-4 my-5">
          This is demo of our project, so don't be rude)
        </p>
        <Link to="chat" className="button is-info is-size-3 mt-6">
          Begin
        </Link>
      </section>
    </>
  )
}
export default Welcome
