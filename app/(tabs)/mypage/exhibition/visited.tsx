import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import TopBar from "../../../../components/ui/TopBar";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useRouter, useFocusEffect } from "expo-router";
import WriteRecordButton from "./WriteRecordButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 임시 데이터
const mockVisitedExhibitions = [
  {
    id: "1",
    title: "클림트 특별전",
    location: "국립중앙박물관",
    visitDate: "2024.01.15",
    rating: 5,
    review: "정말 아름다운 작품들이었어요!",
    image: "https://via.placeholder.com/100x100?text=클림트전",
  },
  {
    id: "2",
    title: "현대미술 특별전",
    location: "MMCA",
    visitDate: "2024.02.20",
    rating: 4,
    review: "흥미로운 작품들이 많았습니다.",
    image: "https://via.placeholder.com/100x100?text=현대미술전",
  },
  {
    id: "3",
    title: "한국 전통미술전",
    location: "국립민속박물관",
    visitDate: "2024.03.05",
    rating: 5,
    review: "우리 전통의 아름다움을 다시 한번 느꼈어요.",
    image: "https://via.placeholder.com/100x100?text=전통미술전",
  },
];

export default function VisitedExhibitionsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState(mockVisitedExhibitions);

  useFocusEffect(
    React.useCallback(() => {
      const loadAndUpdateReviews = async () => {
        try {
          const savedRecordsJSON = await AsyncStorage.getItem('exhibition_records');
          const savedRecords = savedRecordsJSON ? JSON.parse(savedRecordsJSON) : {};

          const updatedExhibitions = mockVisitedExhibitions.map(exhibition => {
            const record = savedRecords[exhibition.id];
            return {
              ...exhibition,
              review: record ? record.title : "아직 기록하지 않은 전시",
            };
          });

          setExhibitions(updatedExhibitions);
        } catch (error) {
          Alert.alert("오류", "기록을 불러오는 중 문제가 발생했습니다.");
        }
      };

      loadAndUpdateReviews();
    }, [])
  );

  const renderExhibitionItem = ({ item }: { item: any }) => (
    <View
      style={[
        styles.exhibitionItem,
        { backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff" },
      ]}>
      <View style={styles.exhibitionImage}>
        <Text style={styles.imagePlaceholder}>🖼️</Text>
      </View>
      <View style={styles.exhibitionInfo}>
        <Text
          style={[
            styles.exhibitionTitle,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}>
          {item.title}
        </Text>
        <Text
          style={[
            styles.exhibitionLocation,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}>
          📍 {item.location}
        </Text>
        <Text
          style={[
            styles.visitDate,
            { color: theme === "dark" ? "#ccc" : "#666" },
          ]}>
          🗓️ 방문일: {item.visitDate}
        </Text>

        {item.review && (
          <Text
            style={[
              styles.reviewText,
              { color: theme === "dark" ? "#ccc" : "#666" },
            ]}>
            💬 "{item.review}"
          </Text>
        )}
      </View>
      <WriteRecordButton 
          title="기록하기" 
          onPress={() =>
            router.push({
              pathname: "/exhibition/write-record",
              params: { exhibitionId: item.id },
            })
          } 
          buttonStyle={{ 
            paddingVertical: 6, 
            paddingHorizontal: 6, 
            marginTop: 8,
            alignSelf: 'flex-start'
          }}
          textStyle={{ fontSize: 14 }}
        />
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#1a1a1a" : "#f5f5f5" },
      ]}>
      <TopBar title='방문한 전시' />
      <View style={styles.title}>
        <Text
          style={[
            styles.title,
            { color: theme === "dark" ? "#fff" : "#1c3519" },
          ]}>
          방문한 전시 ({exhibitions.length}개)
        </Text>
        {exhibitions.length > 0 ? (
          <FlatList
            data={exhibitions}
            renderItem={renderExhibitionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyText,
                { color: theme === "dark" ? "#ccc" : "#666" },
              ]}>
              아직 방문한 전시가 없습니다.
            </Text>
            <Text
              style={[
                styles.emptySubText,
                { color: theme === "dark" ? "#999" : "#999" },
              ]}>
              전시를 관람하고 방문 기록을 남겨보세요!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  exhibitionItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exhibitionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  imagePlaceholder: {
    fontSize: 32,
  },
  exhibitionInfo: {
    flex: 1,
    justifyContent: "center",
  },
  exhibitionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  exhibitionLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  visitDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  reviewText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
  },
});
