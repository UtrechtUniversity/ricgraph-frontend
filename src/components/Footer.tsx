import {getRicgraphSystemInfo} from "../api/endpoints/advanced.ts";

function Footer() {
    const footer = getRicgraphSystemInfo().data?.page_footer;

    return (
        <footer className={"bg-dark-subtle p-3 mt-3"} style={{fontSize: "0.8rem"}}>
            <div dangerouslySetInnerHTML={{__html: footer ?? ''}}/>
        </footer>
    );
}

export default Footer;