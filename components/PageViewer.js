import { Children } from "react";
import styled from "styled-components";

export default function PageViewer({children}) {
    return (
        <PageViewerContainer>
        <PageViewerHeadline>{children}</PageViewerHeadline>
        </PageViewerContainer>
    );
}

const PageViewerContainer = styled.div`
display: flex;
align-items: center;
background-color: var(--dark-green-color);
padding-left: 1rem;
padding-right: 1rem;
border-top-left-radius: 12px;
border-bottom-left-radius: 12px;
height: 55%;
`;

const PageViewerHeadline = styled.h1`
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--white-font-and-icon-color);
    
`;