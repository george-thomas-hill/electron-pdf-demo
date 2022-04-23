import * as React from 'react';
import * as ReactDOM from 'react-dom';

const pathToSRC = `/home/georgehill/Desktop/gh/testElectronPDFs/electron-pdf-demo/`;

const testCustomProtocol = false; // true -> crash; false -> no crash.

function render() {
    ReactDOM.render(<DemoOfMediaLoadingAttempts />, document.body);
}

render();

function DemoOfMediaLoadingAttempts() {
    return (
        <div
            style={{
                position: "fixed",
                inset: "20px",
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
                paddingRight: "20px",
            }}
        >
            <p>Path to src folder is set as: <code>{pathToSRC}</code></p>
            <p>If that is set incorrectly, this demo won't work.</p>
            <IframePNGRemote />
            <IframePNGLocal />
            <IframePDFRemote />
            <IframePDFLocal />
            <IframePDFRemoteWithSandbox />
            <IframePDFLocalWithSandbox />
            <WebviewPNGRemote />
            <WebviewPNGLocal />
            <WebviewPDFRemote />
            <WebviewPDFLocal />
            <IframePNGLocalViaCustomProtocol />
            <IframePDFLocalViaCustomProtocol />
            <WebviewPNGLocalViaCustomProtocol />
            <WebviewPDFLocalViaCustomProtocol />
        </div>
    );
}

function IframePNGRemote() {
    return (<div className='demo'>
        <p>An iframe showing a remote PNG file loads correctly:</p>
        <iframe
            src={`https://upload.wikimedia.org/wikipedia/commons/0/01/Alcal%C3%A1_de_Henares_%28c._1890%29_Plaza_de_Cervantes.png`}
        />
    </div>);
}

function IframePNGLocal() {
    return (<div className='demo'>
        <p>An iframe attemping to load a local PNG file gives a white empty iframe in the browser and an error in the browser console <em>when run in development mode</em>:</p>
        <code>Not allowed to load local resource: file:///home/georgehill/Desktop/gh/testElectronPDFs/my-new-app/src/png-from-wikimedia.png</code>
        <iframe
            src={`file://${pathToSRC}src/png-from-wikimedia.png`}
        />
        <p>However, when run as a packaged application, it loads correctly.</p>
    </div>);
}

function IframePDFRemote() {
    return (<div className='demo'>
        <p>An iframe attempting to load a remote PDF gives a gray empty iframe in the browser and no error in the browser console:</p>
        <iframe
            src={`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`}
        />
    </div>);
}

function IframePDFLocal() {
    return (<div className='demo'>
        <p>An iframe attempting to load a local PDF gives a white empty iframe in the browser and an error in the browser console <em>when run in development mode</em>:</p>
        <code>Not allowed to load local resource: file:///home/georgehill/Desktop/gh/testElectronPDFs/my-new-app/src/dummy.pdf</code>
        <iframe
            src={`file://${pathToSRC}src/dummy.pdf`}
        />
        <p>However, when run as a packaged application, it gives a <em>gray</em> empty iframe.</p>
    </div>);
}

function IframePDFRemoteWithSandbox() {
    return (<div className='demo'>
        <p>An iframe attempting to load a remote PDF with sandbox on gives a white empty iframe in the browser and no error in the browser console:</p>
        <iframe
            src={`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`}
            sandbox={``}
        />
    </div>);
}

function IframePDFLocalWithSandbox() {
    return (<div className='demo'>
        <p>An iframe attempting to load a local PDF with sandbox on gives a white empty iframe in the browser and an error in the browser console:</p>
        <code>Not allowed to load local resource: file:///home/georgehill/Desktop/gh/testElectronPDFs/my-new-app/src/dummy.pdf</code>
        <iframe
            src={`file://${pathToSRC}src/dummy.pdf`}
            sandbox={``}
        />
    </div>);
}

function WebviewPNGRemote() {
    return (<div className='demo'>
        <p>A webview showing a remote PNG file loads correctly:</p>
        <webview
            src={`https://upload.wikimedia.org/wikipedia/commons/0/01/Alcal%C3%A1_de_Henares_%28c._1890%29_Plaza_de_Cervantes.png`}
            webpreferences={
                "sandbox=yes, " +
                "javascript=no, " +
                "autoplayPolicy=document-user-activation-required"
            }
        >
        </webview>
    </div>);
}

function WebviewPNGLocal() {
    return (<div className='demo'>
        <p>A webview showing a local PNG file loads correctly:</p>
        <webview
            src={`file://${pathToSRC}src/png-from-wikimedia.png`}
            webpreferences={
                "sandbox=yes, " +
                "javascript=no, " +
                "autoplayPolicy=document-user-activation-required"
            }
        >
        </webview>
    </div>);
}

function WebviewPDFRemote() {
    return (<div className='demo'>
        <p>A webview attempting to load a remote PDF gives a gray empty webview and no error in the browser console but an error in the system terminal:</p>
        <code>(node:63401) electron: Failed to load URL: https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf with error: ERR_BLOCKED_BY_CLIENT</code>
        <webview
            src={`https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`}
            webpreferences={
                "sandbox=yes, " +
                "javascript=no, " +
                "autoplayPolicy=document-user-activation-required"
            }
        >
        </webview>
    </div>);
}

function WebviewPDFLocal() {
    return (<div className='demo'>
        <p>A webview attempting to load a local PDF gives a gray empty webview and no error in the browser console nor any error in the system terminal:</p>
        <webview
            src={`file://${pathToSRC}src/dummy.pdf`}
            webpreferences={
                "sandbox=yes, " +
                "javascript=no, " +
                "autoplayPolicy=document-user-activation-required"
            }
        >
        </webview>
    </div>);
}

// https://www.robinwieruch.de/react-checkbox/
function Checkbox({ label, value, onChange }) {
    return (
        <label>
            <input type="checkbox" checked={value} onChange={onChange} />
            {label}
        </label>
    );
};

function IframePNGLocalViaCustomProtocol() {

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    const [fileId, setFileId] = React.useState(null);

    const desiredFile = `${pathToSRC}src/png-from-wikimedia.png`;

    React.useEffect(() => {
        let okToSetFileId = true;
        const thePromise = window.electron.ipcApi.askForFileToBeServed(
            desiredFile
        );
        thePromise.then(processTheResult);
        function processTheResult(result) {
            if (okToSetFileId === true) setFileId(result);
        }
        function cleanUp() {
            setFileId(null);
            okToSetFileId = false;
        }
        return cleanUp;
    }, []);

    const useSrc = (checked === false) ?
        null : `protocolname://secretString/${fileId}`;

    const theJSX = <div className='demo'>
        <p>An iframe attempting to load a local PNG via a custom protocol causes a crash. Check the box to make this happen.</p>
        <Checkbox
            label="Check box to attempt to load PNG."
            value={checked}
            onChange={handleChange}
        />
        <iframe
            src={useSrc}
        >
        </iframe>
    </div>;

    return theJSX;

}

function IframePDFLocalViaCustomProtocol() {

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    const [fileId, setFileId] = React.useState(null);

    const desiredFile = `${pathToSRC}src/dummy.pdf`;

    React.useEffect(() => {
        let okToSetFileId = true;
        const thePromise = window.electron.ipcApi.askForFileToBeServed(
            desiredFile
        );
        thePromise.then(processTheResult);
        function processTheResult(result) {
            if (okToSetFileId === true) setFileId(result);
        }
        function cleanUp() {
            setFileId(null);
            okToSetFileId = false;
        }
        return cleanUp;
    }, []);

    const useSrc = (checked === false) ?
        null : `protocolname://secretString/${fileId}`;

    const theJSX = <div className='demo'>
        <p>An iframe attempting to load a local PDF via a custom protocol causes a crash. Check the box to make this happen.</p>
        <Checkbox
            label="Check box to attempt to load PDF."
            value={checked}
            onChange={handleChange}
        />
        <iframe
            src={useSrc}
        >
        </iframe>
    </div>;

    return theJSX;

}

function WebviewPNGLocalViaCustomProtocol() {

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    const [fileId, setFileId] = React.useState(null);

    const desiredFile = `${pathToSRC}src/png-from-wikimedia.png`;

    React.useEffect(() => {
        let okToSetFileId = true;
        const thePromise = window.electron.ipcApi.askForFileToBeServed(
            desiredFile
        );
        thePromise.then(processTheResult);
        function processTheResult(result) {
            if (okToSetFileId === true) setFileId(result);
        }
        function cleanUp() {
            setFileId(null);
            okToSetFileId = false;
        }
        return cleanUp;
    }, []);

    const useSrc = (checked === false) ?
        null : `protocolname://secretString/${fileId}`;

    const theJSX = <div className='demo'>
        <p>A webview showing a local PNG via a custom protocol works correctly. Check the box to make this happen.</p>
        <Checkbox
            label="Check box to load PNG."
            value={checked}
            onChange={handleChange}
        />
        <webview
            src={useSrc}
            webpreferences={
                "sandbox=yes, " +
                "javascript=no, " +
                "autoplayPolicy=document-user-activation-required"
            }
        >
        </webview>
    </div>;

    return theJSX;

}

function WebviewPDFLocalViaCustomProtocol() {

    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
    };

    const [fileId, setFileId] = React.useState(null);

    const desiredFile = `${pathToSRC}src/dummy.pdf`;

    React.useEffect(() => {
        let okToSetFileId = true;
        const thePromise = window.electron.ipcApi.askForFileToBeServed(
            desiredFile
        );
        thePromise.then(processTheResult);
        function processTheResult(result) {
            if (okToSetFileId === true) setFileId(result);
        }
        function cleanUp() {
            setFileId(null);
            okToSetFileId = false;
        }
        return cleanUp;
    }, []);

    const useSrc = (checked === false) ?
        null : `protocolname://secretString/${fileId}`;

    const theJSX = <div className='demo'>
        <p>A webview attempting to load a local PDF via a custom protocol gives a gray empty webview and no error. Check the box to make this happen.</p>
        <Checkbox
            label="Check box to attempt to load PDF."
            value={checked}
            onChange={handleChange}
        />
        <webview
            src={useSrc}
            webpreferences={
                "sandbox=yes, " +
                "javascript=no, " +
                "autoplayPolicy=document-user-activation-required"
            }
        >
        </webview>
    </div>;

    return theJSX;

}
