import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
  // }

  // import Document, { Html, Head, NextScript, Main } from 'next/document';
  // import { ServerStyleSheet } from 'styled-components';

  // export default class MyDocument extends Document {
  //   static getInitialProps({ renderPage }) {
  //     const sheet = new ServerStyleSheet();
  //     const page = renderPage((App) => (props) =>
  //       sheet.collectStyles(<App {...props} />)
  //     );
  //     const styleTags = sheet.getStyleElement();
  //     return { ...page, styleTags };
  //   }

  render() {
    return (
      <Html lang="en-US">
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
