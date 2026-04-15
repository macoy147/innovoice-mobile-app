import { Modal, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { TYPOGRAPHY } from '../../styles/typography';
import { SPACING } from '../../styles/spacing';

export const TermsOfUseModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Terms of Use</Text>
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
          <Text style={styles.lastUpdated}>Last Updated: March 25, 2026</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing and using SSG InnoVoice, you accept and agree to be bound by these Terms of Use. If you do not agree, do not use this Application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Definitions</Text>
            <Text style={styles.bulletPoint}>• "Application" or "App" refers to SSG InnoVoice mobile application</Text>
            <Text style={styles.bulletPoint}>• "SSG" refers to the Supreme Student Government of CTU Daanbantayan Campus</Text>
            <Text style={styles.bulletPoint}>• "User" or "You" refers to any authorized individual using the Application</Text>
            <Text style={styles.bulletPoint}>• "Submission" refers to any report, suggestion, or feedback submitted</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Eligibility</Text>
            <Text style={styles.paragraph}>
              The Application is intended for members of the CTU Daanbantayan Campus community. Users must be enrolled students, faculty/staff, or otherwise authorized by CTU administration.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Permitted Use</Text>
            <Text style={styles.paragraph}>You may use the Application to:</Text>
            <Text style={styles.bulletPoint}>• Report legitimate campus incidents or concerns</Text>
            <Text style={styles.bulletPoint}>• Submit constructive suggestions for campus improvement</Text>
            <Text style={styles.bulletPoint}>• Track the status of your submissions</Text>
            <Text style={styles.bulletPoint}>• Access information about campus services</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Prohibited Conduct</Text>
            <Text style={styles.paragraph}>You agree NOT to:</Text>
            <Text style={styles.bulletPoint}>• Submit false, misleading, or fraudulent reports</Text>
            <Text style={styles.bulletPoint}>• Harass, threaten, defame, or intimidate any individual</Text>
            <Text style={styles.bulletPoint}>• Violate any laws or regulations</Text>
            <Text style={styles.bulletPoint}>• Infringe upon intellectual property rights</Text>
            <Text style={styles.bulletPoint}>• Distribute malware or harmful code</Text>
            <Text style={styles.bulletPoint}>• Attempt unauthorized access to systems</Text>
            <Text style={styles.bulletPoint}>• Submit spam or promotional content</Text>
            <Text style={styles.bulletPoint}>• Upload obscene or inappropriate content</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Submission Guidelines</Text>
            <Text style={styles.paragraph}>
              Submissions must be relevant to campus life and use respectful language. Provide specific details and supporting evidence when appropriate. Maximum photo size: 2MB.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
            <Text style={styles.paragraph}>
              The Application and its content are owned by SSG and CTU. By submitting content, you grant SSG a license to use it for addressing campus concerns and compiling reports.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Privacy</Text>
            <Text style={styles.paragraph}>
              Our collection and use of personal information is governed by our Privacy Policy. Submissions may be shared with relevant CTU departments for resolution.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Disclaimers</Text>
            <Text style={styles.paragraph}>
              THE APPLICATION IS PROVIDED "AS IS" WITHOUT WARRANTIES. SSG does not guarantee specific outcomes or response times. Total liability shall not exceed PHP 1,000.00.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Termination</Text>
            <Text style={styles.paragraph}>
              SSG may suspend or terminate your access at any time for violations of these Terms or other reasons. Previously submitted reports will remain for administrative purposes.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Modifications</Text>
            <Text style={styles.paragraph}>
              SSG reserves the right to modify these Terms at any time. Changes are effective immediately upon posting. Continued use constitutes acceptance of modified Terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Governing Law</Text>
            <Text style={styles.paragraph}>
              These Terms shall be governed by the laws of the Republic of the Philippines. Disputes shall be subject to the exclusive jurisdiction of the courts of Cebu, Philippines.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>13. Contact Information</Text>
            <Text style={styles.paragraph}>
              For questions about these Terms, please contact:
            </Text>
            <Text style={styles.bulletPoint}>• Supreme Student Government</Text>
            <Text style={styles.bulletPoint}>• CTU Daanbantayan Campus</Text>
            <Text style={styles.bulletPoint}>• Email: ssg@ctu.edu.ph</Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By using SSG InnoVoice, you acknowledge that you have read and agree to these Terms of Use. For complete terms, visit our website or contact SSG.
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
