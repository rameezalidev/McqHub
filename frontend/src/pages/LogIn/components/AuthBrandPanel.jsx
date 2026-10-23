import { AuthIllustration, BrandLogoIcon } from "../../../components/icons/Icons";
import { AUTH_TEXT } from "../../../constants/app";

function AuthBrandPanel() {
  return (
    <div className="auth-side-brand">
      <div className="auth-logo-badge">
        <BrandLogoIcon width="28" height="28" />
        <div>
          <h3>{AUTH_TEXT.BRAND_TITLE}</h3>
          <p>{AUTH_TEXT.BRAND_SUBTITLE}</p>
        </div>
      </div>

      <div className="auth-hero-text">
        <h2>{AUTH_TEXT.HERO_TITLE}</h2>
        <p>{AUTH_TEXT.HERO_DESCRIPTION}</p>
      </div>

      <div className="auth-illustration">
        <AuthIllustration />
      </div>
    </div>
  );
}

export default AuthBrandPanel;
