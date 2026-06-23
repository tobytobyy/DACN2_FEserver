import React from 'react';
import { FlatList, Image, Linking, Pressable, Text, View } from 'react-native';
import type { Article } from '../../../types/home';
import styles from './styles';

const VNEXPRESS_HEALTH_URL = 'https://vnexpress.net/suc-khoe';

const formatRelativeTime = (pubDate: string): string => {
  if (!pubDate) return '';
  try {
    const diff = Date.now() - new Date(pubDate).getTime();
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
        <Pressable onPress={() => Linking.openURL(VNEXPRESS_HEALTH_URL)}>
          <Text style={styles.seeMoreText}>Xem thêm</Text>
        </Pressable>
      </View>

      <FlatList
        data={articles}
        keyExtractor={item => item.link}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.articleRow}
            onPress={() => Linking.openURL(item.link)}
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
