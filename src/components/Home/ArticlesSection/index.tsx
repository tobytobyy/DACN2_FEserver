import React from 'react';
import { FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import type { Article } from '../../../types/home';
import styles from './styles';

const VNEXPRESS_HEALTH_URL = 'https://vnexpress.net/suc-khoe';

// FIX 3: Simplify timezone normalization. The old double-replace produced
// "GMT++0700" because $& (full match = "+0700") was appended after $1 ("+").
// This single replace converts "+0700" → "+07:00" which Hermes can parse.
const parseDate = (pubDate: string): Date => {
  const normalized = pubDate.replace(/([+-])(\d{2})(\d{2})$/, '$1$2:$3');
  const d = new Date(normalized);
  if (!isNaN(d.getTime())) return d;
  // Fallback: strip timezone offset entirely
  return new Date(pubDate.replace(/\s+[+-]\d{4}$/, ''));
};

const formatRelativeTime = (pubDate: string): string => {
  if (!pubDate) return '';
  try {
    const diff = Date.now() - parseDate(pubDate).getTime();
    const hours = Math.floor(diff / 3_600_000);
    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  } catch {
    return '';
  }
};

type Props = { articles: Article[] };

const ArticlesSection: React.FC<Props> = ({ articles }) => {
  if (articles.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bài viết sức khỏe</Text>
        {/* FIX 8: Catch and discard openURL rejections to prevent unhandled promise rejections */}
        <Pressable
          onPress={() => Linking.openURL(VNEXPRESS_HEALTH_URL).catch(() => {})}
        >
          <Text style={styles.seeMoreText}>Xem thêm</Text>
        </Pressable>
      </View>

      <FlatList
        data={articles}
        keyExtractor={(item, index) => item.link || item.title || String(index)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.articleRow}
            onPress={() => {
              // FIX 8: Catch and discard openURL rejections
              if (item.link) {
                Linking.openURL(item.link).catch(() => {});
              }
            }}
          >
            {item.thumbnail ? (
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.thumbnail}
              />
            ) : (
              <View style={styles.thumbnailPlaceholder}>
                <Text style={styles.placeholderEmoji}>🏥</Text>
              </View>
            )}
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.articleMeta}>
                {item.source} · {formatRelativeTime(item.pubDate)}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default ArticlesSection;
