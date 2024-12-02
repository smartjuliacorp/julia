export const renderHtml = (title: string, message: string, link?: string): string => `
    <html>
        <head>
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f9f9f9;
                }
                h1 {
                    color: #4CAF50;
                }
                p {
                    font-size: 18px;
                    color: #555;
                }
                a {
                    text-decoration: none;
                    color: #007BFF;
                }
                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <p>${message}</p>
            ${link ? `<a href="${link}">Click here</a>` : ''}
        </body>
    </html>
`;
