import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const IntroScreen = ({ onStart }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.introContainer}>
      <Animated.View
        style={[
          styles.introContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Image
          source={{ uri: 'https://api.a0.dev/assets/image?text=academic%20success%20education%20graduation%20celebration%20modern%20minimal%20illustration&aspect=1:1' }}
          style={styles.introImage}
        />
        <Text style={styles.introTitle}>CGPA Calculator</Text>
        <Text style={styles.introSubtitle}>
          Track your academic progress with ease
        </Text>
        <View style={styles.featuresContainer}>
          <Feature icon="school" text="Calculate CGPA" />
          <Feature icon="trending-up" text="Track Progress" />
          <Feature icon="stars" text="Grade Analysis" />
        </View>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Get Started</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const Feature = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <MaterialIcons name={icon} size={24} color="#FFF" />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const GradeScale = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'RA': 0
};

export default function CGPACalculator() {
  const [showIntro, setShowIntro] = useState(true);
  const [courses, setCourses] = useState([
    { id: 1, name: '', creditHours: '', grade: 'O' }
  ]);
  const [cgpa, setCGPA] = useState(0);
  const [showGradeModal, setShowGradeModal] = useState({ show: false, index: -1 });
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;

  React.useEffect(() => {
    if (!showIntro) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showIntro]);

  const addCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      name: '',
      creditHours: '',
      grade: 'O'
    };
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
      calculateCGPA(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id, field, value) => {
    const updatedCourses = courses.map(course => {
      if (course.id === id) {
        return { ...course, [field]: value };
      }
      return course;
    });
    setCourses(updatedCourses);
    calculateCGPA(updatedCourses);
  };

  const calculateCGPA = (currentCourses) => {
    let totalPoints = 0;
    let totalCredits = 0;

    currentCourses.forEach(course => {
      if (course.creditHours && course.grade) {
        const credits = parseFloat(course.creditHours);
        const gradePoints = GradeScale[course.grade];
        if (!isNaN(credits)) {
          totalPoints += credits * gradePoints;
          totalCredits += credits;
        }
      }
    });

    const calculatedCGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setCGPA(calculatedCGPA);
  };

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <FontAwesome5 name="graduation-cap" size={40} color="#FFF" />
          <Text style={styles.title}>CGPA Calculator</Text>
          <View style={styles.cgpaContainer}>
            <Text style={styles.cgpaLabel}>Current CGPA</Text>
            <Text style={styles.cgpa}>{cgpa}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView}>
        {courses.map((course, index) => (
          <Animated.View 
            key={course.id}
            style={[styles.courseCard]}>
            <View style={styles.courseHeader}>
              <View style={styles.courseTitleContainer}>
                <FontAwesome5 name="book" size={16} color="#4c669f" />
                <Text style={styles.courseTitle}>Course {index + 1}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => removeCourse(course.id)}
                style={styles.removeButton}>
                <MaterialIcons name="remove-circle" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Course Name"
              value={course.name}
              onChangeText={(text) => updateCourse(course.id, 'name', text)}
              placeholderTextColor="#666"
            />

            <View style={styles.rowContainer}>
              <TextInput
                style={[styles.input, styles.creditInput]}
                placeholder="Credit Hours"
                value={course.creditHours}
                keyboardType="numeric"
                onChangeText={(text) => updateCourse(course.id, 'creditHours', text)}
                placeholderTextColor="#666"
              />

              <TouchableOpacity
                style={[
                  styles.gradeButton,
                  { backgroundColor: course.grade === 'RA' ? '#FF4444' : '#4c669f' }
                ]}
                onPress={() => setShowGradeModal({ show: true, index: index })}>
                <Text style={styles.gradeButtonText}>{course.grade}</Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addCourse}>
          <FontAwesome5 name="plus-circle" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Add Course</Text>
        </TouchableOpacity>
      </ScrollView>

      {showGradeModal.show && (
        <View style={styles.modalOverlay}>
          <View style={styles.gradeModal}>
            <Text style={styles.modalTitle}>Select Grade</Text>
            <ScrollView>
              {Object.entries(GradeScale).map(([grade, points]) => (
                <TouchableOpacity
                  key={grade}
                  style={[
                    styles.gradeOption,
                    { backgroundColor: grade === 'RA' ? '#FFE5E5' : '#FFF' }
                  ]}
                  onPress={() => {
                    updateCourse(courses[showGradeModal.index].id, 'grade', grade);
                    setShowGradeModal({ show: false, index: -1 });
                  }}>
                  <Text style={[
                    styles.gradeOptionText,
                    { color: grade === 'RA' ? '#FF4444' : '#333' }
                  ]}>{grade}</Text>
                  <Text style={[
                    styles.gradePointText,
                    { color: grade === 'RA' ? '#FF4444' : '#666' }
                  ]}>({points} points)</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowGradeModal({ show: false, index: -1 })}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  introContent: {
    width: '90%',
    alignItems: 'center',
    padding: 20,
  },
  introImage: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 20,
    borderRadius: 20,
  },
  introTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  introSubtitle: {
    fontSize: 18,
    color: '#FFF',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 30,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 10,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginVertical: 10,
  },
  cgpaContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  cgpaLabel: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.8,
  },
  cgpa: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scrollView: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  removeButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditInput: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  gradeButton: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    justifyContent: 'center',
  },
  gradeButtonText: {
    color: '#FFF',
    fontSize: 16,
    marginRight: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4c669f',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradeModal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  gradeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  gradeOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gradePointText: {
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#4c669f',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  closeButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});