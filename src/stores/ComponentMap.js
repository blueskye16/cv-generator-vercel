import NormalColumn from "@parts/components-template/NormalColumn";
import Description from "@parts/components-template/Description";
import SimpleColumn from "@parts/components-template/SimpleColumn";
import ProfileColumn from "@parts/components-template/ProfileColumn";
import SideTemplateManager from "@parts/components-template/SideTemplateManager";


import CvPreview from "@layout/CvPreview";
import {
  EntryDescription,
  EntryNormal,
  EntrySimple,
  
} from "@layout/PreviewComponents";

export const templateMap = {
  profile: ProfileColumn,
  normal: NormalColumn,
  description: Description,
  simple: SimpleColumn,
  simple_no_link: SimpleColumn,
  templates: SideTemplateManager,
  
  preview: CvPreview,
};

export const previewTemplateMap = {
  normal: EntryNormal,
  simple: EntrySimple,
  simple_no_link: EntrySimple,
  description: EntryDescription,
  
};
