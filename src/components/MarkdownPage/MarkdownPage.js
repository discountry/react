/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import Container from 'components/Container';
import Flex from 'components/Flex';
import MarkdownHeader from 'components/MarkdownHeader';
import NavigationFooter from 'templates/components/NavigationFooter';
import PropTypes from 'prop-types';
import React from 'react';
import StickyResponsiveSidebar from 'components/StickyResponsiveSidebar';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import findSectionForPath from 'utils/findSectionForPath';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';
import {sharedStyles} from 'theme';
import createOgUrl from 'utils/createOgUrl';

const MarkdownPage = ({
  authors,
  createLink,
  date,
  enableScrollSync,
  ogDescription,
  location,
  markdownRemark,
  sectionList,
  titlePostfix = '',
}) => {
  const hasAuthors = authors.length > 0;
  const titlePrefix = markdownRemark.frontmatter.title || '';

  return (
    <Flex
      direction="column"
      grow="1"
      shrink="0"
      halign="stretch"
      css={{
        width: '100%',
        flex: '1 0 auto',
        position: 'relative',
        zIndex: 0,
      }}>
      <TitleAndMetaTags
        ogDescription={ogDescription}
        ogUrl={createOgUrl(markdownRemark.fields.slug)}
        title={`${titlePrefix}${titlePostfix}`}
      />
      <div css={{flex: '1 0 auto'}}>
        <Container>
          <div css={sharedStyles.articleLayout.container}>
            <Flex type="article" direction="column" grow="1" halign="stretch">
              <MarkdownHeader title={titlePrefix} />

              {(date || hasAuthors) && (
                <div css={{marginTop: 15}}>
                  {date}{' '}
                  {hasAuthors && (
                    <span>
                      by{' '}
                      {toCommaSeparatedList(authors, author => (
                        <a
                          css={sharedStyles.link}
                          href={author.frontmatter.url}
                          key={author.frontmatter.name}>
                          {author.frontmatter.name}
                        </a>
                      ))}
                    </span>
                  )}
                </div>
              )}

              <div css={sharedStyles.articleLayout.content}>
                <div
                  css={[sharedStyles.markdown]}
                  dangerouslySetInnerHTML={{__html: markdownRemark.html}}
                />

                {markdownRemark.fields.path && (
                  <div css={{marginTop: 80}}>
                    <a
                      css={sharedStyles.articleLayout.editLink}
                      href={`https://github.com/discountry/react/tree/master/content/${markdownRemark
                        .fields.path}`}>
                      纠错
                    </a>
                  </div>
                )}
              </div>
            </Flex>

            <div css={sharedStyles.articleLayout.sidebar}>
              <StickyResponsiveSidebar
                enableScrollSync={enableScrollSync}
                createLink={createLink}
                defaultActiveSection={findSectionForPath(
                  location.pathname,
                  sectionList,
                )}
                location={location}
                sectionList={sectionList}
              />
            </div>
          </div>
        </Container>
      </div>

      {/* TODO Read prev/next from index map, not this way */}
      {(markdownRemark.frontmatter.next || markdownRemark.frontmatter.prev) && (
        <NavigationFooter
          location={location}
          next={markdownRemark.frontmatter.next}
          prev={markdownRemark.frontmatter.prev}
        />
      )}
    </Flex>
  );
};

MarkdownPage.defaultProps = {
  authors: [],
};

// TODO Better types
MarkdownPage.propTypes = {
  authors: PropTypes.array.isRequired,
  createLink: PropTypes.func.isRequired,
  date: PropTypes.string,
  enableScrollSync: PropTypes.bool,
  location: PropTypes.object.isRequired,
  markdownRemark: PropTypes.object.isRequired,
  sectionList: PropTypes.array.isRequired,
};

export default MarkdownPage;
