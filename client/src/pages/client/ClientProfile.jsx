import PortalButton from "../../components/portal/PortalButton";
import PortalPageHeader from "../../components/portal/PortalPageHeader";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

function ClientProfile() {
  const { user } = useAuth();
  const { t, translateValue } = useLanguage();
  const accountType = translateValue(
    "accountTypes",
    user?.role === "admin" ? "Admin" : "Client",
  );

  return (
    <div className="wd-portal-page">
      <PortalPageHeader
        eyebrow={t("common.labels.clientPortal")}
        title={t("client.profile.title")}
        description={t("client.profile.description")}
        action={(
          <PortalButton to="/start" variant="secondary">
            {t("client.profile.startNew")}
          </PortalButton>
        )}
      />

      <div className="wd-portal-profile">
        <section className="wd-portal-profile__details" aria-labelledby="profile-details-title">
          <div className="wd-portal-profile__section-heading">
            <p>{t("client.profile.primaryLabel")}</p>
            <h2 id="profile-details-title">{t("client.profile.detailsTitle")}</h2>
          </div>

          <dl className="wd-portal-profile__definition-list">
            <ProfileValue label={t("common.labels.name")} value={user?.name || t("client.profile.clientFallback")} />
            <ProfileValue label={t("common.labels.business")} value={user?.businessName || t("client.profile.noBusiness")} />
            <ProfileValue label={t("common.labels.email")} value={user?.email} ltr />
            <ProfileValue label={t("common.labels.phone")} value={user?.phone || t("common.labels.notAdded")} ltr />
            <ProfileValue label={t("common.labels.accountType")} value={accountType} />
          </dl>
        </section>

        <aside className="wd-portal-profile__security" aria-labelledby="profile-security-title">
          <div className="wd-portal-profile__section-heading">
            <p>{t("client.profile.secondaryLabel")}</p>
            <h2 id="profile-security-title">{t("client.profile.securityTitle")}</h2>
          </div>

          <div className="wd-portal-profile__security-block">
            <span>{t("client.profile.verificationLabel")}</span>
            <strong>
              {user?.emailVerified
                ? t("client.profile.emailVerified")
                : t("client.profile.emailNotVerified")}
            </strong>
          </div>

          <div className="wd-portal-profile__security-block">
            <span>{t("client.profile.passwordLabel")}</span>
            <PortalButton to="/forgot-password" variant="ink">
              {t("client.profile.resetPassword")}
            </PortalButton>
          </div>

          <div className="wd-portal-profile__account-note">
            <h3>{t("client.profile.noteTitle")}</h3>
            <p>{t("client.profile.noteDescription")}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProfileValue({ label, value, ltr = false }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd dir={ltr ? "ltr" : undefined} className={ltr ? "wd-ltr" : undefined}>
        {value || "-"}
      </dd>
    </div>
  );
}

export default ClientProfile;
