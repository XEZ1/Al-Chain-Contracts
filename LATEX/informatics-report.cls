\NeedsTeXFormat{LaTeX2e}
\LoadClass{report}
\ProvidesClass{informatics-report}[2012/10/07 Informatics Final Year Project Report Class]

\usepackage{graphicx}
\usepackage[left=1.4in, right=1.4in, top=0.8in, bottom=1.0in]{geometry}
\usepackage{layout}
\usepackage{url}
\usepackage{verbatim}
\usepackage{listings}

\usepackage{lmodern}
\renewcommand{\familydefault}{\rmdefault}

\setcounter{secnumdepth}{2} %Section numbering depth
\setcounter{tocdepth}{1} %Table of Contents depth, section only

%Text
\usepackage{setspace}
%\onehalfspacing
\doublespacing

\def\@title{}
\def\@author{}
\def\@supervisor{}
\def\@date{}
\def\@studentID{}
\def\@wordCount{}

\def\date#1{\gdef\@date{#1}}
\def\supervisor#1{\gdef\@supervisor{#1}}
\def\abstractFile#1{\gdef\@abstractFile{#1}}
\def\studentID#1{\gdef\@studentID{#1}}
%\def\wordCount#1{\gdef\@wordCount{#1}}

%Acknowledgements
\newif\ifacknowledgements@
\acknowledgements@false
\def\ackFile#1{\gdef\@ackFile{#1}\acknowledgements@true}

\def\createFrontMatter{

	%Title Page
    \thispagestyle{empty}
	\newgeometry{top=0.8in}
 
	\begin{center}
		{\large
			\begin{center}
			    \includegraphics[scale=0.4]{FrontMatter/logo.png}\\*
			\end{center}
			\vspace*{2.2in}
			{\huge \bf{\@title}}\\*
			\vspace*{0.4in}
			\Large{Final Project Report}\\*
			\vspace*{1.2in}
			\large{Author: \@author\\*
		       Supervisor: \@supervisor}\\*
	           Student ID: \@studentID\\*
			\vspace*{0.2in}
			{\@date}\\*
		}
	\end{center}
 
	\restoregeometry
	
	%Abstract
	\begin{abstract}
        \setlength{\parindent}{0.3in}
        \input{ \@abstractFile} \relax
	\end{abstract}

	%Originality Avowal
	\thispagestyle{empty}%
        \begin{center}
        \textbf{Originality Avowal}\\*
            \begin{flushleft}
                I verify that I am the sole author of this report, except where explicitly stated to the contrary.
                I grant the right to King's College London to make paper and electronic copies of the submitted work for purposes of marking, plagiarism detection and archival, and to upload a copy of the work to Turnitin or another trusted plagiarism detection service. I confirm this report does not exceed 26,000 words.\\
            \end{flushleft}
  		\begin{flushright}
        		\normalsize{\@author}\\*
		      \normalsize{\@date}\\*
		      %\normalsize{Word count: \@wordCount}
  		\end{flushright}
  	\end{center}

	%Acknowledgements
    \ifacknowledgements@{
        \clearpage
        \thispagestyle{empty}
        \vspace*{1.4in}
        \begin{center}
            {\textbf{Acknowledgements}} \\*
        \end{center}
        \begin{quotation}
		  \begin{flushleft}
     	      \input{\@ackFile}
		  \end{flushleft}
        \end{quotation}
    }\fi	

    \setcounter{page}{0}	
}

\renewcommand{\bibname}{References}