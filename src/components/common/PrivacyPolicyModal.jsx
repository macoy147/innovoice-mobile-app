import React from 'react';
import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const PrivacyPolicyModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.lastUpdated}>Last Updated: March 1, 2026</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to SSG InnoVoice ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services. Please read this privacy policy carefully.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Information We Collect</Text>
            <Text style={styles.subTitle}>2.1 Personal Information</Text>
            <Text style={styles.paragraph}>
              When you choose to submit a non-anonymous report, we may collect:
            </Text>
            <Text style={styles.bulletPoint}>• Full name</Text>
            <Text style={styles.bulletPoint}>• Student ID number</Text>
            <Text style={styles.bulletPoint}>• Email address</Text>
            <Text style={styles.bulletPoint}>• Contact number</Text>
            <Text style={styles.bulletPoint}>• Program and year level</Text>

            <Text style={styles.subTitle}>2.2 Submission Information</Text>
            <Text style={styles.paragraph}>
              We collect information you provide in your submissions:
            </Text>
            <Text style={styles.bulletPoint}>• Report category and title</Text>
            <Text style={styles.bulletPoint}>• Description and content</Text>
            <Text style={styles.bulletPoint}>• Photos or attachments (optional)</Text>
            <Text style={styles.bulletPoint}>• Submission date and time</Text>

            <Text style={styles.subTitle}>2.3 Technical Information</Text>
            <Text style={styles.bulletPoint}>• Device information and operating system</Text>
            <Text style={styles.bulletPoint}>• App version and usage data</Text>
            <Text style={styles.bulletPoint}>• Network connection type</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
            <Text style={styles.paragraph}>We use the collected information to:</Text>
            <Text style={styles.bulletPoint}>• Process and review your submissions</Text>
            <Text style={styles.bulletPoint}>• Provide tracking and status updates</Text>
            <Text style={styles.bulletPoint}>• Forward reports to appropriate departments</Text>
            <Text style={styles.bulletPoint}>• Improve campus services and student welfare</Text>
            <Text style={styles.bulletPoint}>• Communicate with you regarding your submissions</Text>
            <Text style={styles.bulletPoint}>• Maintain and improve our services</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Anonymous Submissions</Text>
            <Text style={styles.paragraph}>
              When you submit anonymously, we do not collect or store any personally identifiable information. Only your report content, category, and tracking code are stored. Your identity remains completely private.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Sharing and Disclosure</Text>
            <Text style={styles.paragraph}>
              We may share your information with:
            </Text>
            <Text style={styles.bulletPoint}>• SSG Feedback Committee members</Text>
            <Text style={styles.bulletPoint}>• Relevant campus departments for action</Text>
            <Text style={styles.bulletPoint}>• Campus administration when necessary</Text>
            <Text style={styles.paragraph}>
              We do not sell, trade, or rent your personal information to third parties.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Data Retention</Text>
            <Text style={styles.paragraph}>
              We retain your submission data for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Your Rights</Text>
            <Text style={styles.paragraph}>You have the right to:</Text>
            <Text style={styles.bulletPoint}>• Access your personal information</Text>
            <Text style={styles.bulletPoint}>• Request correction of inaccurate data</Text>
            <Text style={styles.bulletPoint}>• Request deletion of your data</Text>
            <Text style={styles.bulletPoint}>• Withdraw consent at any time</Text>
            <Text style={styles.bulletPoint}>• Lodge a complaint with relevant authorities</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Our service is intended for students of CTU Daanbantayan Campus. We do not knowingly collect information from individuals under 13 years of age.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Changes to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app and updating the "Last Updated" date.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have questions about this Privacy Policy, please contact:
            </Text>
            <Text style={styles.bulletPoint}>• Supreme Student Government</Text>
            <Text style={styles.bulletPoint}>• CTU Daanbantayan Campus</Text>
            <Text style={styles.bulletPoint}>• Email: ssg@ctu.edu.ph</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using SSG InnoVoice, you acknowledge that you have read and understood this Privacy Policy.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
  },
  headerTitle: {
    ...TYPOGRAPHY.h2,
    color: colors.textDark,
  },
  closeButton: {
    padding: SPACING.sm,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textDark,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  lastUpdated: {
    ...TYPOGRAPHY.caption,
    color: colors.textLight,
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: colors.textDark,
    marginBottom: SPACING.sm,
    fontWeight: 'bold',
  },
  subTitle: {
    ...TYPOGRAPHY.label,
    color: colors.textDark,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  paragraph: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  bulletPoint: {
    ...TYPOGRAPHY.body,
    color: colors.textMedium,
    lineHeight: 24,
    marginLeft: SPACING.md,
    marginBottom: SPACING.xs,
  },
  footer: {
    marginTop: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  footerText: {
    ...TYPOGRAPHY.caption,
    color: colors.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
