import {memo} from "react";

const Footer = memo(function Footer() {

    return (
        <footer>
            <p>&copy; Adopt A Friend {new Date().getFullYear()}</p>
        </footer>
    )
})

export default Footer