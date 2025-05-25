import streamlit as st
import json
from model_utils import CareerRecommender
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime
import os

# Initialize session state for bookmarks
if 'bookmarked_careers' not in st.session_state:
    st.session_state.bookmarked_careers = set()

def generate_pdf_report(recommendations):
    """Generate a PDF report of career recommendations."""
    # Create PDF filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    pdf_filename = f"career_recommendations_{timestamp}.pdf"
    
    # Create PDF document
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []
    
    # Add title
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30
    )
    story.append(Paragraph("Career Path Recommendations", title_style))
    story.append(Spacer(1, 20))
    
    # Add timestamp
    story.append(Paragraph(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}", styles['Normal']))
    story.append(Spacer(1, 30))
    
    # Add recommendations
    for career, similarity in recommendations:
        # Career title
        story.append(Paragraph(career['title'], styles['Heading2']))
        story.append(Spacer(1, 10))
        
        # Description
        story.append(Paragraph("Description:", styles['Heading3']))
        story.append(Paragraph(career['description'], styles['Normal']))
        story.append(Spacer(1, 10))
        
        # Skills
        story.append(Paragraph("Required Skills:", styles['Heading3']))
        skills_text = ", ".join(career['skills'])
        story.append(Paragraph(skills_text, styles['Normal']))
        story.append(Spacer(1, 10))
        
        # Resources
        story.append(Paragraph("Learning Resources:", styles['Heading3']))
        for resource in career['resources']:
            story.append(Paragraph(f"• {resource['name']}: {resource['url']}", styles['Normal']))
        
        story.append(Spacer(1, 20))
    
    # Build PDF
    doc.build(story)
    return pdf_filename

def main():
    st.set_page_config(
        page_title="CareerGuide.ai",
        page_icon="🧠",
        layout="wide"
    )
    
    # Initialize the recommender
    recommender = CareerRecommender()
    
    # Header
    st.title("🧠 CareerGuide.ai")
    st.subheader("AI-Powered Career Path Recommender")
    
    # Sidebar filters
    st.sidebar.header("Filters")
    domain = st.sidebar.selectbox(
        "Domain Preference",
        ["All"] + recommender.get_all_domains()
    )
    level = st.sidebar.selectbox(
        "Career Level",
        ["All"] + recommender.get_all_levels()
    )
    
    # Main content
    user_input = st.text_area(
        "Tell us about your interests, skills, and goals:",
        height=150,
        placeholder="Example: I enjoy working with data, building models, and using Python for analysis. I'm also interested in solving real-world problems in finance."
    )
    
    if st.button("Get Career Recommendations"):
        if user_input:
            # Get recommendations
            recommendations = recommender.get_recommendations(
                user_input,
                domain=None if domain == "All" else domain,
                level=None if level == "All" else level
            )
            
            # Display recommendations
            st.header("Recommended Career Paths")
            
            for career, similarity in recommendations:
                with st.container():
                    col1, col2 = st.columns([0.9, 0.1])
                    
                    with col1:
                        st.subheader(career['title'])
                        st.write(f"**Description:** {career['description']}")
                        st.write("**Required Skills:** " + ", ".join(career['skills']))
                        
                        st.write("**Learning Resources:**")
                        for resource in career['resources']:
                            st.markdown(f"- [{resource['name']}]({resource['url']})")
                    
                    with col2:
                        # Bookmark button
                        if career['title'] in st.session_state.bookmarked_careers:
                            if st.button("★", key=f"unbookmark_{career['title']}"):
                                st.session_state.bookmarked_careers.remove(career['title'])
                                st.rerun()
                        else:
                            if st.button("☆", key=f"bookmark_{career['title']}"):
                                st.session_state.bookmarked_careers.add(career['title'])
                                st.rerun()
                    
                    st.divider()
            
            # Generate PDF button
            if st.button("Download PDF Report"):
                pdf_file = generate_pdf_report(recommendations)
                with open(pdf_file, "rb") as f:
                    st.download_button(
                        label="Download PDF",
                        data=f,
                        file_name=pdf_file,
                        mime="application/pdf"
                    )
                # Clean up the PDF file
                os.remove(pdf_file)
        else:
            st.warning("Please enter your interests, skills, and goals to get recommendations.")
    
    # Display bookmarked careers
    if st.session_state.bookmarked_careers:
        st.sidebar.header("Bookmarked Careers")
        for career_title in st.session_state.bookmarked_careers:
            st.sidebar.write(f"★ {career_title}")

if __name__ == "__main__":
    main() 